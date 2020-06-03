// import createTable from './createTable'
import log from '../../core/lib/utils/log'
import { getEvents, dasherize, getType } from '../../core/lib/utils/index'

const filterParamInvalidValueFn = (data) => {
  if (getType(data) === 'object') {
    let obj = {}
    Object.keys(data).forEach((key) => {
      if ([null, undefined, ''].includes(data[key])) return
      if (typeof data[key] === 'object') {
        obj[key] = filterParamInvalidValueFn(data[key])
      } else {
        obj[key] = data[key]
      }
    })
    return obj
  } else if (getType(data) === 'array') {
    return data.map(item => filterParamInvalidValueFn(item))
  }
  return data
}

export default (props) => {

  let id = 0

  const {
    Table,
    PaginationComponent,
    isDasherize = true,
  } = props

  const YQueryTable = {
    name: 'YQUERYTABLE',
    componentName: 'YQUERYTABLE',
    props: {
      /**
       * 自动过滤serve中无效入参
       */
      filterParamInvalidValue: {
        type: Boolean,
        default: true,
      },
      serve: {
        type: [Function],
        required: true,
      },
      /**
       * 分页信息
       */
      pagination: {
        type: Object,
        default: () => ({}),
      },
      columns: {
        type: Array,
        default: () => []
      },
      paginationPosition: {
        type: String,
        default: 'right',
        validator(value) {
          return ['right', 'left', 'top'].includes(value)
        },
      },
      showLoading: {
        type: Boolean,
        default: true,
      },
      /**
       * 返回底层table 的引用
       */
      wrappedTableRef: {
        type: Function
      }
    },
    computed: {
      yColumns() {
        return this.columns
      },
    },
    data() {
      return {
        pageParams: {
          currentPage: 1,
          pageSize: 10,
        },
        total: 0,
        loading: false,
        list: [],
        ispagination: true,
      }
    },
    mounted() {
      id++
      this.wrappedTableRef && this.wrappedTableRef(this.$refs.table.$refs.YTable)
      this.refreshList()
    },
    latestYform: null,
    methods: {
      setlatestYform() {
        if (!this.$options.latestYform) {
          const getLatestQueryTable = (context) => {
            let parent = context.$parent
            let children = parent.$children || []
            let matchedTable = children.filter(child => {
              return child && child.$options && ((child.$options.componentName === 'YFORM' || child.$options.name === 'YFORM'))
            })

            if (matchedTable.length === 0) {
              if (!parent) {
                log.warn('YQuerytable 没有对应的 YForm')
                return null
              }
              return getLatestQueryTable(parent)
            }

            return matchedTable[0]
          }
          this.$options.latestYform = getLatestQueryTable(this)
        }
      },
      getPaginationProps(someParams = {}) {
        const defaultPaginationProps = {
          pageSizes: [10, 20, 50, 100],
          layout: 'total, prev, pager, next, jumper',
          total: 0,
        }
        return {
          ...defaultPaginationProps,
          ...(this.pagination || {}),
          ...this.pageParams,
          ...someParams,
        }
      },
      // 如果在翻页前需要某些拦截操作，这里需要一个promise
      paginationMethodsIntercept(method) {
        // const methods = [
        //   'onSizeChange', 'onCurrentChange', 'onPrevClick', 'onNextClick'
        // ]
        if (this.pagination && this.pagination[method]) {
          return this.pagination[method]
        } else {
          return (i) => Promise.resolve(i)
        }
      },
      handleSizeChange(pageSize) {
        this.paginationMethodsIntercept('onSizeChange')(pageSize).then(() => {
          this.refreshList({
            currentPage: 1,
            pageSize
          })
        })
      },
      handleCurrentChange(currentPage) {
        this.paginationMethodsIntercept('onCurrentChange')(currentPage).then(() => {
          this.refreshList({ currentPage })
        })
      },
      async refreshList(someParams = {}) {
        // TODO: 自动取消上一次接口
        if (this.loading) return
        this.setlatestYform()
        // form 校验
        await this.$options.latestYform.validate()
        this.loading = true
        const { currentPage, pageSize } = this.getPaginationProps(someParams)
        /**
         * TODO: 可以考虑 formValue 也传过去，实际调用层可以自己获取，不做也行
         */
        const formValues = this.$options.latestYform.value
        return this.serve({
          params: {
            currentPage,
            pageSize,
          },
          formValues: this.filterParamInvalidValue ? filterParamInvalidValueFn(formValues) : formValues,
        }).then(res => {
          this.loading = false
          this.list = res.data
          this.total = res.total
          this.pageParams.currentPage = currentPage
          this.pageParams.pageSize = pageSize
          this.$emit('refreshListCb', {
            total: this.total,
            list: this.list,
            currentPage,
            pageSize,
          })
          return Promise.resolve()
        }).catch(e => {
          log.error(e)
          this.loading = false
          // 修复 element 在分页控件上的问题，element应该是以交互优先
          // 如点击2 2页接口挂掉，其实需要回退到上一页的页码高亮，erlement 还是2
          this.refreshPaginationForUi()
          return Promise.reject(e)
        })
      },
      refreshPaginationForUi() {
        this.ispagination = false
        setTimeout(() => {
          this.ispagination = true
        }, 1)
      }
    },
    render(h) {
      const {
        on: paginationOn = {},
        ...paginationRest
      } = getEvents(this.pagination)

      Object.keys(paginationOn).forEach(key => {
        isDasherize && (paginationOn[dasherize(key)] = paginationOn[key])
      })

      const tableEvents = {}
      Object.keys(this.$listeners).forEach(key => {
        isDasherize && (tableEvents[dasherize(key)] = this.$listeners[key])
      })

      const TableComponent = h(Table, {
        props: {
          ...this.$attrs,
          data: this.list,
          columns: this.yColumns,
        },
        attrs: {
          ...this.$attrs,
          data: this.list,
        },
        on: tableEvents,
        key: this.uniqueKey || String(id),
        ref: 'table'
      })

      const onPageChange = {
        'size-change': i => this.handleSizeChange(i),
        'current-change': i => this.handleCurrentChange(i),
      }

      const paginationEvents = {
        ...paginationOn,
        ...onPageChange,
      }
      
      return (
        <div>
          <div v-loading={this.loading && this.showLoading} >
            {
              TableComponent
            }
          </div>
          <div style={{
            margin: '10px',
            textAlign: this.paginationPosition,
          }}>
            {
              (this.ispagination && this.total > 0) && h(PaginationComponent, {
                props: {
                  ...paginationRest,
                  currentPage: this.pageParams.currentPage,
                  pageSize: this.pageParams.pageSize,
                  total: this.total,
                  disabled: this.loading,
                },
                on: paginationEvents,
                ref: 'pagination'
              })
            }
          </div>
        </div>
      )
    }
  }

  return YQueryTable
}