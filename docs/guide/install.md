```
npm i @yform/vue -S
```

main.js

```js
import {
  useYFormLog,
  extendRules,
  YForm,
  YField,
  YFieldList,
  YButton,
  YQueryTable,
  YTable,
  YLayout,
  YCol,
} from '@yform/vue/lib/element-ui/index.umd'
import '@yform/vue/lib/element-ui/index.css'

extendRules({})
useYFormLog(process.env.NODE_ENV === 'development')

Vue.use(YForm)
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
    // 这里处理 一些组件 基于业务的配置
    return props
  }
})
Vue.use(YFieldList)
Vue.use(YButton)
Vue.use(YQueryTable, {
  name: 'YQueryTable',
  pagination: {
    pageSize: 10,
    pageSizes: [10, 15, 20, 25, 30],
    layout: 'total, sizes, prev, pager, next, jumper',
  }
})
Vue.use(YTable)

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

```

#### extendRules
* yform 底层已内置常见快捷校验, 如果你需要扩展，请使用 extendRules 即可全局扩展

#### useYFormLog
* 一般在 development 环境 启用表单log模式
