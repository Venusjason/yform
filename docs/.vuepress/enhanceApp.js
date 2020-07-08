import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// import { useYFormLog } from '../../packages/vue/lib/YForm/index.umd.js'
import {
  useYFormLog,
  YForm,
  YField,
  YButton,
  YQueryTable,
} from '../../packages/vue/lib/element-ui/index.umd.js'
import '../../packages/vue/lib/element-ui/index.css'

import axios from 'axios'

export default ({ Vue }) => {
  useYFormLog(true)

  Vue.prototype.$axios = axios

  Vue.use(ElementUI)
  Vue.use(YForm, {
    name: 'YForm',
    debug: true,
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
}