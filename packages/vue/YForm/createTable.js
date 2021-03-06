import { dasherize } from '../../core/lib/utils/index'

const EmptyTable = {
  name: 'EMPTYTABLE',
  render() {
    return (
      <div class="y-empty-table">
        <svg t="1603346318685" class="icon" viewBox="0 0 1365 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8996" width="40" height="40"><path d="M1116.091733 7.4752H249.2416L4.573867 377.344v616.448h1356.1856v-616.448L1116.091733 7.4752z m172.987734 369.8688h-174.8992V115.336533l174.8992 262.007467zM312.797867 69.12h739.7376v308.224h-184.9344A185.002667 185.002667 0 0 1 682.666667 562.2784a185.002667 185.002667 0 0 1-184.9344-184.9344H312.797867v-308.224zM251.153067 115.336533v262.007467H76.253867l174.8992-262.007467zM1299.114667 932.181333H66.218667V438.954667h377.582933A246.818133 246.818133 0 0 0 682.666667 623.9232a246.818133 246.818133 0 0 0 238.865066-184.9344H1299.114667v493.1584z" fill="#E6E6E6" p-id="8997"></path></svg>
        <div>暂无数据</div>
      </div>
    )
  }
}

export default ({TableComponent, TableColumnComponent}) => {

  let id = 0

  const YTABLE = {
    name: 'YTABLE',
    componentName: 'YTABLE',
    // 全局use的时候可以自定义 column type，依赖于运行时
    columnTypes: {},
    // 全局 use 的时候可定制 empty 样式
    EmptyComponnet: EmptyTable,
    // empty 是按照element api设计的，其他ui库扩展时可自定义
    emptySlotName: 'empty',
    // table 默认props, 一般用来定制统一的ui配置，如斑马纹
    defaultProps: {},
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
    computed: {
      YQUERYTABLE() {
        if (this.$parent && this.$parent.$options && this.$parent.$options.componentName === 'YQUERYTABLE') {
          return this.$parent
        }
        return null
      },
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
      const { columnTypes, defaultProps } = this.$options
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

      // template 语法 slots 无法动态更新， 所以scopedslotsn 只保留 empty
      // 0.1.34 - 0.1.36版本有此问题
      const { EmptyComponnet, emptySlotName } = this.$options
      let parentSlots = {
        [emptySlotName]: () => <EmptyComponnet />,
        ...this.$scopedSlots,
      }

      if (this.YQUERYTABLE && this.YQUERYTABLE.$slots && this.YQUERYTABLE.$slots[emptySlotName]) {
        Object.keys(this.YQUERYTABLE.$slots).forEach(slotName => {
          // 转换slot的this
          this.YQUERYTABLE.$slots[slotName].context = this._self
          // TODO: 没有传参，暂时不需要
          parentSlots[slotName] = () => this.YQUERYTABLE.$slots[slotName]
        })
      }

      return h(TableComponent, {
        props: {
          ...defaultProps,
          ...this.$attrs,
          columns: this.columns,
        },
        on: events,
        scopedSlots: parentSlots,
        key: this.uniqueKey || String(id),
        ref: 'YTable'
      }, renderSlotColumns || renderColomns)
    },
  }

  return YTABLE
}