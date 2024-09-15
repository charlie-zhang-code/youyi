import { Icon } from '@iconify/vue'
import { NIcon } from 'naive-ui'

export function renderIcon(icon: string) {
  // return () => h(NIcon, { size: '20' }, { default: () => h(icon) })
  return () => h(NIcon, { size: '20' }, { default: () => h(Icon, { icon }) })
}
