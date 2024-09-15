import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { PluginOption } from 'vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'

export function setupVitePlugins() {
  const plugins: PluginOption = [
    vue(),
    vueJsx(),
    UnoCSS(),
    AutoImport({
      dts: 'src/typings/auto-imports.d.ts',
      imports: [
        'vue',
        'vue-router',
        'pinia',
        'vue-i18n',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        }
      ],
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/]
    }),
    Components({
      dts: 'src/typings/components.d.ts',
      resolvers: [NaiveUiResolver(), IconsResolver({ prefix: false })]
    }),
    Icons({
      autoInstall: false,
      compiler: 'vue3'
    })
  ]

  return plugins
}
