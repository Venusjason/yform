import { dasherize } from '../../core/lib/utils/index'

export default ({TableComponent, TableColumnComponent}) => {

  let id = 0

  const YTABLE = {
    name: 'YTABLE',
    componentName: 'YTABLE',
    // 全局use的时候可以自定义 column type，依赖于运行时
    columnTypes: {},
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
    methods: {
      // 渲染自定义type
      renderColumnType: function(columnItem) {
        return columnScopedProps => {
          const { columnTypes } = this.$options
          return columnTypes[columnItem.type](columnScopedProps.row[columnItem.prop], columnScopedProps, columnItem)
        }
      }
    },
    render(h) {
      const events = {}
      Object.keys(this.$listeners).forEach(key => {
        events[dasherize(key)] = this.$listeners[key]
      })

      const { renderColumnType } = this
      const { columnTypes } = this.$options
      const renderColomns = this.columns.map((column, i) => {
        const { render, ...rest } = column
        const isCustumeType = column.type && Object.prototype.hasOwnProperty.call(columnTypes, column.type)

        const scopedSlots = isCustumeType ? {
          default: renderColumnType(rest)
        } : (
          render && {
            default: columnProps => render(columnProps),
          }
        )
        return h(TableColumnComponent, {
          props: rest,
          key: i + (column.prop || ''),
          scopedSlots,
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