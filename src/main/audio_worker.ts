import sherpa_onnx from 'sherpa-onnx-node'
import portAudio from 'naudiodon2'
import { parentPort } from 'worker_threads'

import punctuationModel from '../../resources/sherpa_module/sherpa-onnx-punct-ct-transformer-zh-en-vocab272727-2024-04-12/model.onnx?asset&asarUnpack'
import encoderModel from '../../resources/sherpa_module/sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20/encoder-epoch-99-avg-1.onnx?asset&asarUnpack'
import decoderModel from '../../resources/sherpa_module/sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20/decoder-epoch-99-avg-1.onnx?asset&asarUnpack'
import joinerModel from '../../resources/sherpa_module/sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20/joiner-epoch-99-avg-1.onnx?asset&asarUnpack'
import tokens from '../../resources/sherpa_module/sherpa-onnx-streaming-zipformer-bilingual-zh-en-2023-02-20/tokens.txt?asset&asarUnpack'
// import speakerModel
//   from '../../resources/sherpa_module/3dspeaker_speech_eres2net_base_sv_zh-cn_3dspeaker_16k/3dspeaker_speech_eres2net_base_sv_zh-cn_3dspeaker_16k.onnx?asset&asarUnpack'

// 标点模型
function createPunctuation() {
  const config = {
    model: {
      ctTransformer: punctuationModel,
      debug: true,
      numThreads: 1,
      provider: 'cpu'
    }
  }

  return new sherpa_onnx.Punctuation(config)
}

// 语音识别
function createOnlineRecognizer() {
  const config = {
    // 特征提取配置
    featConfig: {
      sampleRate: 16000, // 采样率为16000Hz
      featureDim: 80 // 特征维度为80
    },
    modelConfig: {
      transducer: {
        encoder: encoderModel,
        decoder: decoderModel,
        joiner: joinerModel
      },
      tokens: tokens,
      numThreads: 4,
      provider: 'cpu',
      debug: 1
    },
    decodingMethod: 'greedy_search',
    maxActivePaths: 4,
    enableEndpoint: true, // 启用端点检测
    rule1MinTrailingSilence: 2.4, // 规则1：最小尾随静音时长
    rule2MinTrailingSilence: 1.2, // 规则2：最小尾随静音时长
    rule3MinUtteranceLength: 50 // 规则3：最小话语长度
  }

  return new sherpa_onnx.OnlineRecognizer(config) // 返回语音识别器实例
}

// 说话人识别
// function createSpeakerEmbeddingExtractor() {
//   const config = {
//     model: speakerModel,
//     numThreads: 1,
//     debug: true
//   }
//
//   return new sherpa_onnx.SpeakerEmbeddingExtractor(config) // 返回说话人识别提取器实例
// }

// 计算嵌入
// function computeEmbedding(extractor, filename) {
//   const stream = extractor.createStream()
//   const wave = sherpa_onnx.readWave(filename)
//   stream.acceptWaveform({ sampleRate: wave.sampleRate, samples: wave.samples })
//   return extractor.compute(stream)
// }

// 标点
const punctuation = createPunctuation()

// 语音识别
const recognizer = createOnlineRecognizer()
const stream = recognizer.createStream() // 创建语音识别流

// 说话人识别
// const threshold = 0.6 // 设置识别阈值
// const extractor = createSpeakerEmbeddingExtractor()
// const speakerManager = new sherpa_onnx.SpeakerEmbeddingManager(extractor.dim)

let streamLastText = '' // 语音识别最新文本
let segmentIndex = 0 // 存储说话人识别的段落索引
let punctuation_text = '' // 处理后标点文本
// let speaker = '' // 说话人

// naudiodon2 portAudio
const ai = portAudio.AudioIO({
  inOptions: {
    channelCount: 1, // 单声道
    closeOnError: true,
    deviceId: -1, // 默认设备ID
    sampleFormat: portAudio.SampleFormatFloat32, // 样本格式为Float32
    sampleRate: recognizer.config.featConfig.sampleRate // 采样率与语音识别器一致
  }
})

// 语音识别处理
let isPaused = false
ai.on('data', (data) => {
  // 监听来自主进程的消息
  parentPort?.on('message', (msg) => {
    if (msg.type === 'pause') {
      isPaused = true // 设置暂停标志为 true
    } else if (msg.type === 'resume') {
      isPaused = false // 设置暂停标志为 false, 继续处理音频数据
    }
  })

  const samples = new Float32Array(data.buffer) // 将数据转换为Float32Array

  // 接受音频波形数据
  stream.acceptWaveform({
    sampleRate: recognizer.config.featConfig.sampleRate,
    samples: samples
  })

  // 循环处理直到没有更多数据可解码
  while (recognizer.isReady(stream)) {
    recognizer.decode(stream)
  }

  const isEndpoint = recognizer.isEndpoint(stream) // 检查是否到达端点
  const text = recognizer.getResult(stream).text.toLowerCase() // 获取识别的文本

  // 如果识别到新的文本
  if (text.length > 0 && streamLastText != text) {
    streamLastText = text
    punctuation_text = punctuation.addPunct(streamLastText) // 添加标点

    if (!isPaused) {
      // 如果没有暂停，则发送消息
      // 通过parentPort发送消息
      parentPort?.postMessage({
        type: 'stream_text_data',
        code: 200,
        endpoint: false,
        speaker: '<Unkonwn>',
        segment: segmentIndex,
        payload: punctuation_text,
        time: new Date().getTime()
      })
    }
  }

  // 如果到达端点
  if (isEndpoint) {
    if (text.length > 0) {
      // 发送端点消息
      if (!isPaused) {
        // 如果没有暂停，则发送消息
        parentPort?.postMessage({
          type: 'stream_text_data',
          code: 200,
          endpoint: true,
          speaker: '<Unkonwn>',
          segment: segmentIndex,
          payload: punctuation_text,
          time: new Date().getTime()
        })
      }

      streamLastText = text
      segmentIndex += 1
    }

    recognizer.reset(stream) // 重置识别器流
  }
})

// 开始音频输入
ai.start()

// 发送初始化信息
parentPort?.postMessage({
  type: 'stream_started',
  code: 200,
  endpoint: true,
  speaker: null,
  segment: 0,
  payload: null,
  time: new Date().getTime()
})
