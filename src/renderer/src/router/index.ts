import { createRouter, createWebHistory } from 'vue-router'
import type { App } from 'vue'
import { setupRouterGuard } from './guard'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      // 根路径重定向到首页
      path: '/',
      name: 'root',
      redirect: '/home'
    },
    {
      // 首页
      path: '/home',
      name: 'home',
      component: () => import('@renderer/views/home/index.vue')
    },
    {
      // 创建
      path: '/create',
      name: 'create',
      component: () => import('@renderer/views/create/index.vue')
    },
    {
      // 管理
      path: '/management',
      name: 'management',
      component: () => import('@renderer/views/management/index.vue')
    },
    {
      // 创建会议
      path: '/meeting',
      name: 'meeting',
      children: [
        {
          // 创建、查看、编辑会议页面
          path: '/meeting-mode/:meetingmode?/:rawdata?',
          name: 'meeting-mode',
          component: () => import('@renderer/views/meeting/components/meeting-mode.vue')
        },
        {
          // 会议记录页面
          path: '/meeting-record',
          name: 'meeting-record',
          component: () => import('@renderer/views/meeting/components/meeting-record.vue')
        }
      ]
    },
    {
      // 总结纪要
      path: '/summary',
      name: 'summary',
      component: () => import('@renderer/views/summary/index.vue')
    },
    {
      // 纪要生成
      path: '/generate',
      name: 'generate',
      component: () => import('@renderer/views/summary/components/generate.vue')
    },
    {
      // 设置
      path: '/settings',
      name: 'settings',
      component: () => import('@renderer/views/settings/index.vue')
    },
    {
      // 关于
      path: '/about',
      name: 'about',
      component: () => import('@renderer/views/about/index.vue')
    },
    {
      // 关于
      path: '/result-page/success/:successdescription?',
      name: 'success',
      component: () => import('@renderer/views/result-page/success.vue')
    }
  ]
})

export async function installRouter(app: App) {
  setupRouterGuard(router)
  app.use(router)
  await router.isReady()
}
