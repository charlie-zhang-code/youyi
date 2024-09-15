import { createApp } from 'vue'
import { installPinia } from '@renderer/stores'
import { installRouter } from '@renderer/router'

import App from '@renderer/App.vue'

import 'uno.css'
import '@renderer/assets/main.css'

async function setup() {
  const app = createApp(App)

  await installPinia(app)
  await installRouter(app)

  app.mount('#app')
}

setup()
