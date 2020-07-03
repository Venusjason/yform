import merge from 'lodash/merge'
// import { Loading } from 'element-ui'
import { getType } from '../../core/lib/utils/index'
import {
  Form as VueForm,
  Field as VueField,
  createTable,
  createQueryTable,
  createYButton,
} from '../YForm/index'

// console.log(Loading)

// export const getMySlots = (fieldContext, context, slotName = '*') => {
//   const slotNames = slotName.split(',')

//   const keys = Object.keys(fieldContext.$slots)
//   const acceptKeys = keys.filter(key => slotName === '*' || slotNames.includes(key))

//   return acceptKeys.reduce((arr, key) => arr.concat(fieldContext.$slots[key]), []).map(vnode => {
//     vnode.context = context._self
//     return vnode
//   })
// }

export const ElForm = merge({}, VueForm, {
  provide() {
    return {
      elForm: this,
      YForm: this,
    };
  },
})

// export const Form = ({
//   name: 'ElForm',
//   componentName: 'ElForm',
//   provide() {
//     return {
//       elForm: this
//     };
//   },
//   render(h) {
//     return h(VueForm, {
//       props: {
//         ...this.$attrs
//       },
//       attrs: {
//         ...this.$attrs,
//       },
//       on: {
//         ...this.$listeners
//       }
//     }, [
//       this.$slots.default,
//     ])
//   },
// })

export const ElField = merge({}, VueField, {
  provide() {
    return {
      elFormItem: this,
      YField: this
    }
  },
  elFormItem: true,
  computed: {
    elFormItemSize() {
      return this.fieldSize
    },
    fieldClassNames() {
      return {
        'el-form-item': true,
        'is-error': this.errorMsg !== '',
        'is-success': this.errorMsg === '',
        'is-required': this.isRequired,
        'is-no-asterisk': this.YForm && this.YForm.hideRequiredAsterisk,
        'is-inline': this.isInline,
        'mr4': this.isInline,
      }
    },
    // 适配el-select
    dataSourceSlots() {
      /**
       * 支持Vnode类型
       */
      const { component, dataSource } = this

      if (!dataSource) return []
      let slots = []
      let labelValues = []
      switch(getType(dataSource)) {
        case 'map':
          labelValues = Array.from(dataSource).map(([value, label]) => {
            if (getType(label) === 'object') {
              return {
                ...label,
                value
              }
            }
            return { label, value }
          })
          break
        case 'array':
          labelValues = dataSource.map((item) => {
            if (typeof item !== 'object') {
              return { label: item, value: item }
            } else {
              return item
            }
          })
          break
        case 'object':
          labelValues = Object.keys(dataSource).map(value => ({
            label: dataSource[value],
            value
          }))
          break
      }
      if (component === 'el-select') {
        slots = labelValues.map(item => (<el-option  {...item} label={item.label} value={item.value} ></el-option>))
      } else if (component === 'el-radio-group') {
        slots = labelValues.map(item => (<el-radio {...item} label={item.value}>{item.label}</el-radio>))
      } else {
        console.log(`${component} 暂未支持dataSource属性`)
      }
      return slots
    },
  },
})

export const ElTable = createTable({
  TableComponent: 'el-table',
  TableColumnComponent: 'el-table-column',
})

// TODO: table 层loading 注入
export const ElQueryTable = merge({}, createQueryTable({
  Table: ElTable,
  PaginationComponent: 'el-pagination',
}), {
  computed: {
    yColumns() {
      return this.columns.map((column) => {
        if (column.type === 'y-index') {
          return {
            label: '序号',
            ...column,
            render: (record) => {
              const { currentPage, pageSize } = this.pageParams
              const value = (currentPage - 1) * pageSize + record.$index + 1
              return column.render ? column.render({
                ...record,
                currentPage,
                pageSize,
              }) : value
            }
          }
        }
        return column
      })
    },
  },
})

export const ElButton = createYButton('el-button')

export const YForm = {
  install: function(Vue, option = { name: 'YForm', debug: false }) {
    merge(ElForm.globalOptions, option)
    Vue.component(
      ElForm.name,
      ElForm,
    )
  }
}

export const YField = {
  install: function(Vue, option = {
    name: 'YField',
    defaultComponent: 'el-input',
  }) {
    merge(ElField.globalOptions, option)
    Vue.component(
      option.name || ElField.name,
      ElField
    )
  }
}

export const YTable = {
  install: function(Vue, option = { name: 'YTable' }) {
    Vue.component(
      option.name || ElTable.name,
      ElTable,
    )
  }
}

export const YQueryTable = {
  install: function(Vue, option = {}) {
    merge(ElQueryTable.globalOptions, { name: 'YQueryTable' }, option)
    Vue.component(
      option.name || ElQueryTable.name,
      ElQueryTable,
    )
  }
}

export const YButton = {
  install: function(Vue, option = { name: 'YButton' }) {
    Vue.component(
      option.name || ElButton.name,
      ElButton,
    )
  }
}
