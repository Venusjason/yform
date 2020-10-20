import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// import { useYFormLog } from '../../packages/vue/lib/YForm/index.umd.js'
import {
  useYFormLog,
  extendRules,
  YForm,
  YField,
  YButton,
  YQueryTable,
  YTable,
  YLayout,
  YCol,
} from '../../packages/vue/lib/element-ui/index.umd.js'
import '../../packages/vue/lib/element-ui/index.css'
import './reset.css'

import axios from 'axios'
import propsData from './propsData'

export default ({ Vue }) => {
  useYFormLog(true)

  /* yform 底层已内置常见快捷校验, 如果你需要扩展，请使用 extendRules 即可全局扩展 */
  /* 规则格式同 element-ui rules */
  extendRules({
    limit10words: {
      trigger: 'change',
      validator: (rule, value, cb) => {
        if (value && value.length > 10) {
          cb(new Error('请输入少于10个字符串'))
        } else {
          cb()
        }
      }
    }
  })

  Vue.prototype.$axios = axios
  Vue.prototype.propsData = propsData

  Vue.use(ElementUI)
  Vue.use(YForm, {
    name: 'YForm',
    debug: true,
  })
  Vue.use(YTable, {
    name: 'YTable',
    columnTypes: {
      'y-money': (value, scopedValue, columnProps) => {
        console.log(value, scopedValue, columnProps)
        return `￥${value}`
      }
    }
  })
  Vue.use(YField, {
    name: 'YField',
    defaultComponent: 'el-input',
    componentProps: ({
      component = 'el-input',
      label
    }) => {
      const props = {
        placeholder: `请选择${label}`
      }
      if (component === 'el-input') {
        props.placeholder = `请输入${label}`
        props.clearable = true
      } else if (component === 'el-select') {
        props.clearable = true
        props.filterable = true
      }
      return props
    },
  })
  Vue.use(YButton)
  Vue.use(YQueryTable, {
    name: 'YQueryTable',
    pagination: {
      pageSize: 10,
      pageSizes: [10, 15, 20, 25, 30],
      layout: 'total, sizes, prev, pager, next, jumper',
    }
  })

  Vue.use(YLayout, {
    breakpointWidth: {
      xs: 480,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
      xxl: 1600,
    }
  })
  Vue.use(YCol, {
    collapseButtonComponent: {
      tag: 'YButton',
      props: {
        type: 'text',
      }
    }
  })
}