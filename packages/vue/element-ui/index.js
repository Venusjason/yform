import merge from 'lodash/merge'
// import { Loading } from 'element-ui'
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
  },
})

export const ElTable = createTable({
  TableComponent: 'el-table',
  TableColumnComponent: 'el-table-column',
})

// TODO: table 层loading 注入
export const ElQueryTable = createQueryTable({
  Table: ElTable,
  PaginationComponent: 'el-pagination',
})

export const ElButton = createYButton('el-button')

export const YForm = {
  install: function(Vue, option = { name: 'YForm' }) {
    Vue.component(
      option.name || ElForm.name,
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
  install: function(Vue, option = { name: 'YQueryTable' }) {
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