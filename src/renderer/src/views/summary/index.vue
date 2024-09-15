<script setup lang="tsx">
import { renderIcon } from '../../utils/icon'
import { router } from '../../router'

import { DataTableColumns, NButton, NFlex } from 'naive-ui'
import { useMeetingStore } from '../../stores/meet'

const meetingStore = useMeetingStore()

async function viewAction(row) {
  meetingStore.clearMeetingData()
  meetingStore.setMeetingData(row)
  router.push(`/meeting-mode/view/content`)
}

async function generateAction(row) {
  const { time, ...restOfRow } = row
  const parsedTime = parseInt(time, 10)
  const newRow = {
    ...restOfRow,
    time: parsedTime
  }

  meetingStore.clearGenerateData()
  meetingStore.setGenerateData(newRow)
  router.push(`/generate`)
}

const columns: DataTableColumns = [
  {
    title: 'ID',
    align: 'center',
    key: 'id',
    width: 30,
    fixed: 'left'
  },
  {
    title: '名称',
    align: 'center',
    key: 'name',
    width: 100,
    ellipsis: true
  },
  {
    title: '创建日期',
    align: 'center',
    key: 'updated_at',
    width: 40,
    ellipsis: true
  },
  {
    title: '操作',
    align: 'center',
    key: 'actions',
    width: 60,
    fixed: 'right',
    render: (row) => {
      return (
        <NFlex justify="center">
          <NButton
            size="small"
            render-icon={renderIcon('icon-park-outline:eyes')}
            onClick={() => viewAction(row)}
          >
            查看
          </NButton>
          <NButton
            size="small"
            type="info"
            render-icon={renderIcon('icon-park-outline:write')}
            onClick={() => generateAction(row)}
          >
            生成
          </NButton>
        </NFlex>
      )
    }
  }
]

const pagination = {
  pageSize: 10
}

const data = ref([])

async function getData() {
  const message = await window.api.getAllMeetings()
  data.value = message.map((item) => {
    return {
      ...item,
      tags: JSON.parse(item.tags),
      content: JSON.parse(item.content)
    }
  })
}

getData()
</script>

<template>
  <n-flex>
    <n-card>
      <n-data-table
        :columns="columns"
        :data="data"
        :bordered="false"
        :row-key="(row) => row.id"
        :pagination="pagination"
        class="h-full"
        flex-height
        :scroll-x="800"
      />
    </n-card>
  </n-flex>
</template>

<style scoped></style>
