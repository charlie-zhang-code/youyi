<script setup lang="ts">
import { router } from '../../router'

const route = useRoute()
const successdescription = route.params.successdescription as string

function goHome() {
  router.push('/home')
}
</script>

<template>
  <n-flex>
    <n-card>
      <n-flex justify="center" align="center" class="h-full">
        <n-result status="success" title="成功" :description="successdescription">
          <template #footer>
            <n-button @click="goHome">返回首页</n-button>
          </template>
        </n-result>
      </n-flex>
    </n-card>
  </n-flex>
</template>

<style scoped></style>
