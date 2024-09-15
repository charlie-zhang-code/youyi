import type { Router } from 'vue-router'
import { useRouteStore } from '../stores/router'

export function setupRouterGuard(router: Router) {
  const routeStore = useRouteStore()

  router.beforeEach(async (_to, _from, next) => {
    await routeStore.init()
    next()
  })

  router.beforeResolve(async (to) => {
    routeStore.setActiveMenu(to.fullPath)
  })
}
