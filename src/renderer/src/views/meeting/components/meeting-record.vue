<script setup lang="ts">
import { useBoolean } from '../../../hooks/useBoolean'
import { useMeetingStore } from '../../../stores/meet'
import { useRouteStore } from '../../../stores/router'
import { createTimer, formatDateTime } from '../../../utils/timer'
import {
  copyToClipboard,
  hideCopyButton,
  showCopyButton,
  showCopyButtonIndex
} from '../../../utils/copy'
import { router } from '../../../router'

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean()
const { bool: startButtonShow, setTrue: setStartButtonNotShow } = useBoolean()
const {
  bool: buttonDisable,
  setTrue: setButtonDisable,
  setFalse: setButtonNotDisable
} = useBoolean()
const { bool: startRecordTime, setTrue: setStartRecordTime } = useBoolean()
const { bool: showButton, setTrue: setShowButton } = useBoolean()

const dialog = useDialog()
const message = useMessage()
const notification = useNotification()

const routeStore = useRouteStore()

// 从pina获取来自表单路由的会议数据
const meetingStore = useMeetingStore()
const meetingDataRef = ref<Data.MeetingFormValue>({
  name: '',
  location: '',
  time: 0,
  tags: [],
  description: '',
  status: '',
  host: '',
  attendees: '',
  outline: '',
  subjects: '',
  content: [],
  duration: '',
  created_at: '',
  updated_at: ''
})
onMounted(() => {
  const meetingData = meetingStore.meetingData
  if (meetingData) {
    meetingDataRef.value = meetingData
  }
})

// 数据流初始化
const streamData = ref<Data.StreamData>({
  type: 'null',
  code: 0,
  endpoint: false,
  speaker: 'unknown',
  segment: '0',
  payload: '请点击开始',
  time: '0'
})

// 结果集（显示和原生）
const resultList = ref<Data.StreamData[]>([])
function startRecord() {
  setStartButtonNotShow()
  setButtonDisable()
  startLoading()

  streamData.value.payload = '正在加载...'

  routeStore.resetMenus()
  routeStore.setDisableMenus()

  // 获取转录数据流
  window.api.startStream()
  window.api.onStreamTextData((_event, args) => {
    setButtonNotDisable()
    endLoading()
    setStartRecordTime()
    setShowButton()

    streamData.value = args

    if (args['endpoint'] && args['payload'] !== null) {
      resultList.value.push(args)
      if (meetingDataRef.value) {
        meetingDataRef.value['content'] = resultList.value
      }

      streamData.value = {
        type: '',
        code: 0,
        endpoint: false,
        speaker: 'loading',
        segment: 'loading',
        payload: 'loading',
        time: '0'
      }
    }
  })
}

function stopRecord() {
  dialog.warning({
    title: '警告',
    content: '确定停止吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      myTimer.stop()

      // 序列化
      const meetingData = JSON.stringify(meetingDataRef.value)

      window.api.insertMeeting(meetingData)
      window.api.stopStream()

      routeStore.resetMenus()
      routeStore.init()

      const description = '会议记录已保存'
      const path = `/result-page/success/${description}`
      router.push(path)
    },
    onNegativeClick: () => {
      message.success('取消成功')
    }
  })
}

function pauseRecord() {
  window.api.pauseStream()
  myTimer.stop()
}

function resumeRecord() {
  window.api.resumeStream()
  myTimer.start()
}

watch(startRecordTime, (newValue) => {
  if (newValue) {
    myTimer.start()
  }
})

const timeStr = ref()
const isPaused = ref(false)
const myTimer = createTimer((time, paused, totalSeconds) => {
  timeStr.value = time
  isPaused.value = paused
  if (meetingDataRef.value) {
    meetingDataRef.value.duration = totalSeconds
  }
})

const messageShow = (message, data) => {
  notification.success({
    content: message,
    meta: data,
    duration: 2500,
    keepAliveOnHover: true
  })
}
</script>

<template>
  <n-flex class="relative">
    <n-layout embedded class="bg-transparent">
      <n-split direction="horizontal" class="flex-1 absolute" :max="0.75" :min="0.25">
        <template #1>
          <n-scrollbar>
            <n-flex vertical class="p-r-8px">
              <n-spin :show="loading">
                <template #description>
                  <n-text>正在加载进程...</n-text>
                </template>
                <n-list hoverable clickable>
                  <n-list-item
                    v-for="(record, index) in resultList"
                    :key="index"
                    @mouseenter="showCopyButton(index)"
                    @mouseleave="hideCopyButton()"
                  >
                    <n-thing content-style="margin-top: 10px;">
                      <template #description>
                        <n-flex size="small" style="margin-top: 4px">
                          <n-tag :bordered="false" type="info" size="small">
                            {{ record.segment }}
                          </n-tag>
                          <!--                  TODO        <n-tag :bordered="false" type="success" size="small">-->
                          <!--                            {{ record.speaker }}-->
                          <!--                          </n-tag>-->
                          <n-tag :bordered="false" type="warning" size="small">
                            {{ formatDateTime(record.time) }}
                          </n-tag>
                          <n-flex style="margin-left: auto">
                            <n-button
                              v-if="showCopyButtonIndex == index"
                              size="tiny"
                              @click="copyToClipboard(record.payload, messageShow)"
                            >
                              复制
                            </n-button>
                          </n-flex>
                        </n-flex>
                      </template>
                      {{ record.payload }}
                    </n-thing>
                  </n-list-item>
                  <n-list-item>
                    <n-thing content-style="margin-top: 10px;">
                      <template #description>
                        <n-flex size="small" style="margin-top: 4px">
                          <n-tag :bordered="false" type="info" size="small">
                            {{ streamData.segment }}
                          </n-tag>
                          <!--                    TODO      <n-tag :bordered="false" type="success" size="small">-->
                          <!--                            {{ streamData.speaker }}-->
                          <!--                          </n-tag>-->
                          <n-tag :bordered="false" type="warning" size="small">
                            {{ formatDateTime(streamData.time) }}
                          </n-tag>
                        </n-flex>
                      </template>

                      <Transition name="fade" mode="out-in">
                        <n-text class="text-red">{{ streamData.payload }}</n-text>
                      </Transition>
                    </n-thing>
                  </n-list-item>
                </n-list>
              </n-spin>
            </n-flex>
          </n-scrollbar>
        </template>
        <template #2>
          <n-flex class="p-l-8px" align="center">
            <n-card>
              <n-flex justify="space-between" align="center">
                <n-flex>
                  <n-text>{{ timeStr }}</n-text>
                </n-flex>
                <n-flex align="center">
                  <!-- 开始按钮 -->
                  <n-button
                    v-if="!startButtonShow"
                    type="primary"
                    size="small"
                    :loading="loading"
                    @click="startRecord"
                  >
                    开始
                  </n-button>

                  <!-- 暂停/继续按钮 -->
                  <n-button
                    v-if="isPaused"
                    size="small"
                    :disabled="buttonDisable || !showButton"
                    @click="resumeRecord"
                  >
                    继续
                  </n-button>
                  <n-button
                    v-if="!isPaused"
                    type="info"
                    size="small"
                    :disabled="buttonDisable || !showButton"
                    @click="pauseRecord"
                  >
                    暂停
                  </n-button>

                  <!-- 停止按钮 -->
                  <n-button
                    v-if="startRecordTime"
                    type="error"
                    size="small"
                    :disabled="buttonDisable || !showButton"
                    @click="stopRecord"
                  >
                    停止
                  </n-button>
                </n-flex>
              </n-flex>
            </n-card>
          </n-flex>

          <n-scrollbar>
            <n-flex vertical class="p-l-8px"></n-flex>
          </n-scrollbar>
        </template>
      </n-split>
    </n-layout>
  </n-flex>
</template>

<style scoped>
@keyframes gradient-animation {
  0% {
    color: #2080f0;
  }
  50% {
    color: #ff0000;
  }
  100% {
    color: #2080f0;
  }
}

.text-red {
  animation: gradient-animation 3s infinite;
}
</style>
