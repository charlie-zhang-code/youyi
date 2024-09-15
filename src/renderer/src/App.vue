<script setup lang="ts">
import { zhCN } from 'naive-ui'
import Index from '@renderer/layouts/index.vue'
</script>

<template>
  <n-config-provider :locale="zhCN">
    <n-message-provider placement="bottom-right">
      <n-dialog-provider>
        <n-notification-provider placement="bottom-right">
          <n-message-provider>
            <Index />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
