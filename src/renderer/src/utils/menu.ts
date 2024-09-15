import type { MenuOption } from 'naive-ui'
import { NButton, NFlex, NIcon } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { Icon } from '@iconify/vue'
import { renderIcon } from './icon'
import { inputMenuOptions } from '../router/menus'
import { inputSettingOptions } from '../router/settings'
import { router } from '../router'
import { useRouteStore } from '../stores/router'

function transformMenuOptions(menuOptions) {
  return menuOptions.map((item) => {
    const { label, key, icon, path, children } = item
    let labelWithRouterLink

    // 如果有path，则使用RouterLink渲染
    if (path) {
      labelWithRouterLink = () => h(RouterLink, { to: { path } }, { default: () => label })
    } else {
      // 没有path，直接返回label
      labelWithRouterLink = label
    }

    const transformedItem: MenuOption = {
      label: labelWithRouterLink,
      key: key,
      icon: renderIcon(icon)
    }

    if (children && children.length > 0) {
      transformedItem.children = transformMenuOptions(children)
    }

    return transformedItem
  })
}

function transformMenuOptionsDisable(menuOptions) {
  return menuOptions.map((item) => {
    const { label, key, icon, children } = item

    const transformedItem: MenuOption = {
      label: label,
      key: key,
      disabled: true, // 禁用
      icon: renderIcon(icon)
    }

    if (children && children.length > 0) {
      transformedItem.children = transformMenuOptions(children)
    }

    return transformedItem
  })
}

function getSettingOptions(settingOptions) {
  const routeStore = useRouteStore()

  return settingOptions.map((item) => {
    const { label, icon } = item

    return h(
      NButton,
      {
        quaternary: true,
        style: 'width: 80px; -webkit-app-region: no-drag;',
        disabled: routeStore.disableHeaderRoutes, // 禁用按钮
        onClick: () => router.push(item.path)
      },
      {
        icon: () => h(NIcon, { size: '20' }, { default: () => h(Icon, { icon }) }),
        default: () => label
      }
    )
  })
}

function settingOptionList(settingOptions) {
  return [
    {
      type: 'render',
      label: 'label',
      key: 'key',
      render: () =>
        h(
          NFlex,
          {
            vertical: true,
            style: 'padding: 0 5px'
          },
          { default: () => getSettingOptions(settingOptions) }
        )
    }
  ]
}

export const menuOptionsDisable = transformMenuOptionsDisable(inputMenuOptions)

export const menuOptions = transformMenuOptions(inputMenuOptions)

export const settingOptions = settingOptionList(inputSettingOptions)
