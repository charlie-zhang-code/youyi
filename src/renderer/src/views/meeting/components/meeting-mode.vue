<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useMeetingStore } from '../../../stores/meet'
import { router } from '../../../router'
import {
  copyToClipboard,
  hideCopyButton,
  showCopyButton,
  showCopyButtonIndex
} from '../../../utils/copy'
import { formatDateTime } from '../../../utils/timer'

const route = useRoute()
const meetingStore = useMeetingStore()
const notification = useNotification()
const message = useMessage()

const formValue = ref<Data.MeetingFormValue>({
  name: '',
  location: '',
  time: Date.now(),
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

const meetingmode = route.params.meetingmode
const rawdata = route.params.rawdata

if (meetingmode === 'view' || meetingmode === 'edit') {
  formValue.value = meetingStore.meetingData
}

async function createMeeting() {
  meetingStore.setMeetingData(formValue.value)
  router.push({ name: 'meeting-record' })
}

async function updateMeeting() {
  const meetingData = JSON.stringify(formValue.value)
  await window.api.updateMeetingById(formValue.value.id, meetingData)
  message.success('会议信息更新成功')
  router.push({ name: 'management' })
}

const formRef = ref<FormInst | null>(null)

const messageShow = (message, data?) => {
  notification.success({
    content: message,
    meta: data,
    duration: 2500,
    keepAliveOnHover: true
  })
}
</script>

<template>
  <n-flex>
    <n-card v-if="rawdata !== 'content'">
      <n-form
        ref="formRef"
        :model="formValue"
        :label-width="100"
        :disabled="meetingmode === 'view'"
      >
        <n-grid :cols="2" :x-gap="8" :y-gap="8">
          <n-form-item-gi :span="1" label="会议名称">
            <n-input v-model:value="formValue.name" placeholder="请输入会议名称" />
          </n-form-item-gi>
          <n-form-item-gi :span="1" label="会议地点">
            <n-input v-model:value="formValue.location" />
          </n-form-item-gi>

          <n-form-item-gi :span="1" label="会议时间">
            <n-date-picker v-model:value="formValue.time" type="datetime" />
          </n-form-item-gi>

          <n-form-item-gi :span="1" label="会议标签">
            <n-dynamic-tags v-model:value="formValue.tags" />
          </n-form-item-gi>

          <n-form-item-gi :span="2" label="会议描述">
            <n-input v-model:value="formValue.description" type="textarea" />
          </n-form-item-gi>

          <!--      TODO    <n-form-item-gi :span="2" label="会议参会者">-->
          <!--            <n-tabs type="line" animated>-->
          <!--              <n-tab-pane name="participants-file-import" tab="导入参会人员">-->
          <!--                <n-upload-->
          <!--                  multiple-->
          <!--                  directory-dnd-->
          <!--                  action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"-->
          <!--                  :max="5"-->
          <!--                >-->
          <!--                  <n-upload-dragger>-->
          <!--                    <div style="margin-bottom: 12px">-->
          <!--                      <n-icon size="48" :depth="3">-->
          <!--                        <icon-park-outline-paperclip />-->
          <!--                      </n-icon>-->
          <!--                    </div>-->
          <!--                    <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来导入</n-text>-->
          <!--                  </n-upload-dragger>-->
          <!--                </n-upload>-->
          <!--              </n-tab-pane>-->
          <!--            </n-tabs>-->
          <!--          </n-form-item-gi>-->
          <!--          <n-form-item-gi :span="2" label="会议主持人">-->
          <!--            <n-transfer-->
          <!--              virtual-scroll-->
          <!--              source-title="参会者人员"-->
          <!--              target-title="主持人"-->
          <!--              target-filterable-->
          <!--              source-filterable-->
          <!--            />-->
          <!--          </n-form-item-gi>-->
          <!--          <n-form-item-gi :span="2" label="会议大纲">-->
          <!--            <n-tabs type="line" animated>-->
          <!--              <n-tab-pane name="outline-file-import" tab="导入会议议程">-->
          <!--                <n-upload-->
          <!--                  multiple-->
          <!--                  directory-dnd-->
          <!--                  action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"-->
          <!--                  :max="5"-->
          <!--                >-->
          <!--                  <n-upload-dragger>-->
          <!--                    <div style="margin-bottom: 12px">-->
          <!--                      <n-icon size="48" :depth="3">-->
          <!--                        <icon-park-outline-paperclip />-->
          <!--                      </n-icon>-->
          <!--                    </div>-->
          <!--                    <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来导入</n-text>-->
          <!--                  </n-upload-dragger>-->
          <!--                </n-upload>-->
          <!--              </n-tab-pane>-->
          <!--            </n-tabs>-->
          <!--          </n-form-item-gi>-->
          <!--          <n-form-item-gi :span="2" label="会议议程">-->
          <!--            <n-timeline>-->
          <!--              <n-timeline-item />-->
          <!--              <n-timeline-item />-->
          <!--              <n-timeline-item />-->
          <!--            </n-timeline>-->
          <!--          </n-form-item-gi>-->
        </n-grid>
      </n-form>

      <template #footer>
        <n-flex justify="end">
          <n-button
            v-if="meetingmode !== 'view' && meetingmode !== 'edit'"
            type="primary"
            @click="createMeeting"
          >
            创建
          </n-button>
          <n-button v-if="meetingmode === 'edit'" type="primary" @click="updateMeeting"
            >保存
          </n-button>
        </n-flex>
      </template>
    </n-card>

    <n-flex v-if="rawdata === 'content'" class="w-full" vertical>
      <n-card>
        <template #header>
          <n-flex justify="center"> 会议内容 </n-flex>
        </template>
      </n-card>
      <n-list hoverable clickable class="w-full">
        <n-list-item
          v-for="(record, index) in formValue.content"
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
                <!--                <n-tag :bordered="false" type="success" size="small">-->
                <!--                  {{ record.speaker }}-->
                <!--                </n-tag>-->
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
      </n-list>
    </n-flex>
  </n-flex>
</template>

<style scoped>
.s {
  position: sticky;
}
</style>
