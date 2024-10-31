<script setup lang="ts">
import { useMeetingStore } from '../../../stores/meet'
import { useBoolean } from '../../../hooks/useBoolean'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

const id = 'preview-only'
const text = ref('Null')
const message = useMessage()
const meetingStore = useMeetingStore()

const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean()
const notification = useNotification()

async function generate() {
  try {
    startLoading()

    notification.success({
      content: '处理中',
      meta: '请稍等片刻...',
      duration: 2500,
      keepAliveOnHover: true
    })
    // 正在加载中
    // 发送请求
    // 正确地使用单引号定义 URL
    const response = await fetch('http://127.0.0.1:8069/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        template: '模板内容',
        content: meetingStore.generateData.content
      })
    })

    // 确保响应状态是成功的
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 解析 JSON 数据
    const data = await response.json()
    text.value = data?.response

    notification.success({
      content: '处理完成',
      meta: '处理完成',
      duration: 2500,
      keepAliveOnHover: true
    })

    endLoading()
  } catch (error) {
    // 错误处理
    console.error('Fetching data failed:', error)
  }
}

async function exportDocument() {
  const data = JSON.stringify({
    title: meetingStore.generateData.name,
    da: 'success',
    ab: 'success'
  })
  try {
    const { success } = await window.api.exportDocument(data)
    if (success) {
      message.success('导出成功')
    } else {
      message.error('导出失败')
    }
  } catch (error) {
    console.error(error) // 处理可能发生的错误
  }
}
</script>

<template>
  <n-flex class="relative">
    <n-layout embedded class="bg-transparent">
      <n-split direction="horizontal" class="flex-1 absolute" :max="0.75" :min="0.25">
        <template #1>
          <n-flex class="p-r-8px" align="center">
            <n-card>
              <template #header>
                <n-flex justify="center">源</n-flex>
              </template>
            </n-card>
          </n-flex>
          <n-scrollbar>
            <n-flex vertical class="p-r-8px">
              <n-card hoverable>
                <n-h3>{{ meetingStore.generateData.name }}</n-h3>
                <n-blockquote>{{ meetingStore.generateData.description }}</n-blockquote>
                <n-blockquote>{{ meetingStore.generateData.location }}</n-blockquote>
                <n-h4>会议内容</n-h4>
                <n-p v-for="(p, index) in meetingStore.generateData.content" :key="index">
                  {{ p.payload }}
                </n-p>
                <!--                <n-input v-for="(p, index) in meetingStore.generateData.content" :key="index" :value="p.payload" />-->
              </n-card>
            </n-flex>
          </n-scrollbar>
        </template>
        <template #2>
          <n-flex class="p-l-8px" align="center">
            <n-card>
              <template #header> 预览</template>
              <template #header-extra>
                <n-flex>
                  <n-button type="primary" @click="generate" :loading="loading">生成</n-button>
                  <n-button type="primary" @click="exportDocument">确认</n-button>
                </n-flex>
              </template>
            </n-card>
          </n-flex>
          <n-scrollbar>
            <n-flex vertical class="p-l-8px">
              <n-card hoverable class="m-b-20">
                <MdPreview :editorId="id" :modelValue="text" />
              </n-card>
            </n-flex>
          </n-scrollbar>
        </template>
      </n-split>
    </n-layout>
  </n-flex>
</template>

<style scoped></style>
