<script setup lang="ts">
import { settingOptions } from '../../utils/menu'
import icon from '../../../../../resources/icon.png'

const winMax = ref(false)

function minWin() {
  window.electron.ipcRenderer.send('min-win')
}

window.electron.ipcRenderer.on('win-status', (_event, args) => {
  const { maximize } = args
  winMax.value = maximize
})

function toggleWin() {
  window.electron.ipcRenderer.send('max-restore')
}

function closeWin() {
  window.electron.ipcRenderer.send('close-win')
}
</script>

<template>
  <n-flex
    align="center"
    justify="space-between"
    style="width: 100%; height: 100%; -webkit-app-region: drag"
  >
    <!-- Logo图标/名称 -->
    <n-flex align="center">
      <n-avatar round size="medium" :src="icon" />
      <h2>友议</h2>
    </n-flex>

    <n-flex align="center">
      <n-flex align="center">
        <!--        <n-button class="no-drag-btn">-->
        <!--          登录-->
        <!--        </n-button>-->
        <n-dropdown class="no-drag-btn" trigger="hover" :options="settingOptions">
          <n-button text class="no-drag-btn">
            <template #icon>
              <icon-park-outline-drop-down-list />
            </template>
          </n-button>
        </n-dropdown>
      </n-flex>
      <n-divider vertical />
      <!-- 最小化、最大化、关闭按钮 -->
      <n-flex align="center">
        <n-button text class="win-btn" @click="minWin">
          <icon-park-outline-minus />
        </n-button>
        <n-button text class="win-btn" @click="toggleWin">
          <template #icon>
            <icon-park-outline-expand-text-input v-if="!winMax" />
            <icon-park-outline-collapse-text-input v-else />
          </template>
        </n-button>
        <n-button text class="win-btn" @click="closeWin">
          <template #icon>
            <icon-park-outline-close />
          </template>
        </n-button>
      </n-flex>
    </n-flex>
  </n-flex>
</template>

<style scoped></style>
