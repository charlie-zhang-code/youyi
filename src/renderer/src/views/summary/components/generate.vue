<script setup lang="ts">
import { useMeetingStore } from '../../../stores/meet'

const meetingStore = useMeetingStore()
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
              <template #header> 预览 </template>
              <template #header-extra>
                <n-flex>
                  <n-button type="primary">重新</n-button>
                  <n-button type="primary">确认</n-button>
                </n-flex>
              </template>
            </n-card>
          </n-flex>
          <n-scrollbar>
            <n-flex vertical class="p-l-8px">
              <n-card hoverable>
                <!--               TODO -->
              </n-card>
            </n-flex>
          </n-scrollbar>
        </template>
      </n-split>
    </n-layout>
  </n-flex>
</template>

<style scoped></style>
