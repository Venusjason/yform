import { dasherize } from '../../core/lib/utils/index'

export default ({TableComponent, TableColumnComponent}) => {

  let id = 0

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
      uniqueKey: {},
    },
    mounted() {
      id++
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

      const renderSlotColumns = this.$slots.default || this.$slots.columns

      return h(TableComponent, {
        props: {
          ...this.$attrs,
          columns: this.columns,
        },
        on: events,
        key: this.uniqueKey || String(id),
        ref: 'YTable'
      }, renderSlotColumns || renderColomns)
    },
  }

  return YTABLE
}