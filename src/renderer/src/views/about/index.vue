<script setup lang="ts">
import icon from '../../../../../resources/icon.png'
</script>

<template>
  <n-flex>
    <n-card>
      <template #header>
        <n-flex justify="center" align="center" vertical>
          <n-avatar round :size="60" :src="icon" />
          <n-h2>友议助手</n-h2>
        </n-flex>
      </template>
      <n-p>
        友议是一款基于Vue3和Electron开发的跨平台桌面应用，旨在为用户提供一个简洁、高效的会议纪要管理工具，帮助用户快速记录会议内容，提高工作效率。
      </n-p>
      <n-h3> 本应用具有以下特点：</n-h3>
      <n-ol>
        <n-li>界面简洁，操作方便，用户可以轻松上手。</n-li>
        <n-li>支持多平台，包括Windows、Mac和Linux。</n-li>
        <n-li>支持多种会议纪要格式，包括Markdown、HTML和PDF。</n-li>
        <n-li>支持语音识别，方便用户实时记录会议内容。</n-li>
      </n-ol>
      <n-h3> 主要开发者：</n-h3>
      <n-ul>
        <n-li>
          <n-a href="https://gitee.com/z-shey" target="_blank">@时叶Shey</n-a>
        </n-li>
        <n-li>
          <n-a href="https://gitee.com/yushenghuan" target="_blank">@yushenghuan</n-a>
        </n-li>
      </n-ul>
    </n-card>
  </n-flex>
</template>

<style scoped></style>
