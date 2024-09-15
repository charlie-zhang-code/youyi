export const useAppStore = defineStore('app-store', {
  state: () => {
    return {
      collapsed: false
    }
  },

  getters: {},

  actions: {
    toggleCollapse() {
      this.collapsed = !this.collapsed
    }
  },

  persist: {
    storage: localStorage
  }
})
