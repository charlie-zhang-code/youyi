<script setup lang="ts">
import Header from '@renderer/layouts/header/index.vue'
import Sidebar from '@renderer/layouts/sidebar/index.vue'
import { router } from '../router'
import { useRouteStore } from '../stores/router'

const routeStore = useRouteStore()
</script>

<template>
  <n-layout class="w-screen h-screen" embedded>
    <!-- 头部 -->
    <n-layout-header
      bordered
      position="absolute"
      class="z-99"
      style="height: 60px; padding: 0 15px"
    >
      <Header />
    </n-layout-header>

    <!-- 内容 -->
    <n-layout has-sider>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :native-scrollbar="false"
        :collapsed="true"
        content-style="display: flex; flex-direction: column; min-height:100%;height: calc(100vh - 40px)"
      >
        <n-scrollbar class="flex-1">
          <n-el class="h-60px" />
          <Sidebar />
        </n-scrollbar>
      </n-layout-sider>

      <!-- 主内容 -->
      <n-layout
        embedded
        class="mbg"
        :native-scrollbar="false"
        style="height: calc(100vh - 40px)"
        content-style="display: flex; flex-direction: column; min-height:100%;"
      >
        <n-el class="h-60px" />
        <n-flex vertical class="flex-1 p-16px">
          <router-view v-slot="{ Component, route }" class="flex-1">
            <transition name="fade-slide" mode="out-in">
              <!--            <Transition name="fade" mode="out-in">-->
              <component :is="Component" :key="route.fullPath" />
            </transition>
          </router-view>
        </n-flex>
      </n-layout>
    </n-layout>

    <!-- 底部 -->
    <n-layout-footer bordered style="height: 40px">
      <n-flex align="center" justify="space-between" class="h-full p-x-16px">
        <n-text>© 2023-2024</n-text>
        <n-flex align="center">
          <n-button
            class="no-drag-btn"
            text
            :disabled="routeStore.disableHeaderRoutes"
            @click="router.back"
          >
            <template #icon>
              <icon-park-outline-back-one />
            </template>
          </n-button>
          <n-button
            class="no-drag-btn"
            text
            :disabled="routeStore.disableHeaderRoutes"
            @click="router.go(1)"
          >
            <template #icon>
              <icon-park-outline-go-ahead />
            </template>
          </n-button>
        </n-flex>
      </n-flex>
    </n-layout-footer>
  </n-layout>
</template>

<style scoped></style>
