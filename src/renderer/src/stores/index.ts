import type { App } from 'vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export function installPinia(app: App) {
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
}
