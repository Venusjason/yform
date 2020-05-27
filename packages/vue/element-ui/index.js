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

export const getMySlots = (fieldContext, context, slotName = '*') => {
  const slotNames = slotName.split(',')

  const keys = Object.keys(fieldContext.$slots)
  const acceptKeys = keys.filter(key => slotName === '*' || slotNames.includes(key))

  return acceptKeys.reduce((arr, key) => arr.concat(fieldContext.$slots[key]), []).map(vnode => {
    vnode.context = context._self
    return vnode
  })
}

export const Form = ({
  name: 'ElForm',
  componentName: 'ElForm',
  provide() {
    return {
      elForm: this
    };
  },
  render(h) {
    return h(VueForm, {
      props: {
        ...this.$attrs
      },
      attrs: {
        ...this.$attrs,
      },
      on: {
        ...this.$listeners
      }
    }, [
      this.$slots.default,
    ])
  },
})

export const Field = merge({}, VueField, {
  provide() {
    return {
      elFormItem: this,
    }
  },
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

export const Table = createTable({
  TableComponent: 'el-table',
  TableColumnComponent: 'el-table-column',
})

// TODO: table 层loading 注入
export const QueryTable = createQueryTable({
  Table,
  PaginationComponent: 'el-pagination',
})

export const Button = createYButton('el-button')