import Layout from './layout.vue'
import Col from './col.vue'

import log from '../../../core/lib/utils/log'

export const YLayout = {
  install: (Vue, option) => {
    if (option && option.breakpointWidth) {
      Layout.breakpointWidth = option.breakpointWidth
    }
    Vue.component(
      Layout.name,
      Layout
    )
  }
}

export const YCol = {
  install: (Vue, option) => {
    if (!option) {
      log.warn('全局注册 ycol时，请入参option')
    } else {
      Object.assign(Col.collapseButtonComponent, option.collapseButtonComponent)
    }
    Vue.component(
      Col.name,
      Col
    )
  }
}
