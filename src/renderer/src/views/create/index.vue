<script setup lang="ts">
const router = useRouter()

const goToMeetingCreate = (meetingmode, rawdata = null) => {
  let path = `/meeting-mode/${meetingmode}`
  if (rawdata) {
    path += `/${rawdata}`
  }
  router.push(path)
}
</script>

<template>
  <n-flex vertical>
    <n-card>
      <template #header>
        <n-flex justify="center"> 选择模式 </n-flex>
      </template>
    </n-card>

    <n-flex justify="space-between" class="flex-1" :wrap="false">
      <n-card hoverable>
        <template #header>
          <n-flex justify="center"> 创建会议 </n-flex>
        </template>
        <n-button text class="w-full h-full" @click="goToMeetingCreate('add')">
          <n-flex vertical align="center">
            <n-icon size="100" color="gray">
              <icon-park-outline-inbox />
            </n-icon>
            <n-text depth="3"> 该模式将从麦克风输入音频实时转录进行保存会议 </n-text>
          </n-flex>
        </n-button>
      </n-card>

      <n-card hoverable>
        <template #header>
          <n-flex justify="center"> 录音转录 </n-flex>
        </template>
        <n-button text class="w-full h-full">
          <n-flex vertical align="center">
            <n-icon size="100" color="gray">
              <icon-park-outline-inbox />
            </n-icon>
            <n-text depth="3"> 该模式将从音频转录进行保存会议 </n-text>
          </n-flex>
        </n-button>
      </n-card>
    </n-flex>
  </n-flex>
</template>

<style scoped></style>
