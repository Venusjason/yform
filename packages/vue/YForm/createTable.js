import { dasherize } from '../../core/lib/utils/index'

export default ({TableComponent, TableColumnComponent}) => {
  const YTABLE = {
    name: 'YTABLE',
    componentName: 'YTABLE',
    props: {
      /**
       * 列ui自定义
       */
      columns: {
        type: Array,
        default: () => [],
      },
    },
    render(h) {
      const events = {}
      Object.keys(this.$listeners).forEach(key => {
        events[dasherize(key)] = this.$listeners[key]
      })

      const renderColomns = this.columns.map((column, i) => {
        const { render, ...rest } = column
        return h(TableColumnComponent, {
          props: rest,
          key: i + (column.prop || ''),
          scopedSlots: render && {
            default: columnProps => render(columnProps)
          }
        })
      })

      return h(TableComponent, {
        props: {
          ...this.$attrs,
          columns: this.columns,
        },
        on: events,
        ref: 'YTable'
      }, renderColomns)
    },
  }

  YTABLE.install = function(Vue, options = {
    name: 'YTable'
  }) {
    Vue.component(options.name || YTABLE.name, YTABLE)
  }
  return YTABLE
}