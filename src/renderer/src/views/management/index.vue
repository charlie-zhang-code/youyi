<script setup lang="tsx">
import { renderIcon } from '../../utils/icon'
import { router } from '../../router'

import { DataTableColumns, NButton, NFlex, NPopconfirm } from 'naive-ui'
import { useMeetingStore } from '../../stores/meet'

const meetingStore = useMeetingStore()

async function viewAction(row) {
  const { time, ...restOfRow } = row
  const parsedTime = parseInt(time, 10)
  const newRow = {
    ...restOfRow,
    time: parsedTime
  }

  meetingStore.clearMeetingData()
  meetingStore.setMeetingData(newRow)
  router.push(`/meeting-mode/view`)
}

async function editAction(row) {
  const { time, ...restOfRow } = row
  const parsedTime = parseInt(time, 10)
  const newRow = {
    ...restOfRow,
    time: parsedTime
  }

  meetingStore.clearMeetingData()
  meetingStore.setMeetingData(newRow)
  router.push(`/meeting-mode/edit`)
}

async function deleteAction(id) {
  meetingStore.clearMeetingData()
  await window.api.deleteMeetingById(id)
  await getData()
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
    width: 100,
    fixed: 'right',
    render: (row) => {
      return (
        <NFlex justify="center">
          {/* <NButton
            size="small"
            render-icon={renderIcon('icon-park-outline:eyes')}
            onClick={() => viewAction(row)}
          >
            查看
          </NButton>
          <NButton
            size="small"
            render-icon={renderIcon('icon-park-outline:edit-two')}
            type="primary"
            onClick={() => editAction(row)}
          >
            编辑
          </NButton> */}
          <NPopconfirm onPositiveClick={() => deleteAction(row.id)}>
            {{
              default: () => '确认删除',
              trigger: () => (
                <NButton
                  size="small"
                  render-icon={renderIcon('icon-park-outline:delete-five')}
                  type="error"
                >
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
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
