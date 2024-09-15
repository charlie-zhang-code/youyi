import type { MenuOption } from 'naive-ui'
import { menuOptions, menuOptionsDisable } from '../../utils/menu'

interface RoutesStatus {
  menus: MenuOption[]
  activeMenu: string | null
  disableHeaderRoutes: boolean
}

export const useRouteStore = defineStore('route-store', {
  state: (): RoutesStatus => {
    return {
      menus: [],
      activeMenu: null,
      disableHeaderRoutes: false
    }
  },

  actions: {
    setActiveMenu(key: string) {
      this.activeMenu = key.replace('/', '')
    },
    async setDisableMenus() {
      this.disableHeaderRoutes = true
      this.menus = menuOptionsDisable
    },
    async init() {
      this.disableHeaderRoutes = false
      this.menus = menuOptions
    },
    resetMenus() {
      this.menus = []
    }
  }
})
