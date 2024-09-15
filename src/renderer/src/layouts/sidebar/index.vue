<script setup lang="ts">
import { useRouteStore } from '../../stores/router'
import type { MenuInst } from 'naive-ui'

const route = useRoute()
const routeStore = useRouteStore()

const menuInstanceRef = ref<MenuInst | null>(null)

watch(
  () => route.path,
  () => {
    menuInstanceRef.value?.showOption(route.path as string)
  },
  { immediate: true }
)
</script>

<template>
  <n-menu
    ref="menuInstanceRef"
    :options="routeStore.menus"
    :value="routeStore.activeMenu"
    :collapsed="true"
    :indent="20"
    :collapsed-width="64"
  />
</template>

<style scoped></style>
