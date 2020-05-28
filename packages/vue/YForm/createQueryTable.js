// import createTable from './createTable'
import log from '../../core/lib/utils/log'
import { getEvents, dasherize } from '../../core/lib/utils/index'

export default (props) => {

  const {
    Table,
    PaginationComponent,
    isDasherize = true,
  } = props

  const YQueryTable = {
    name: 'YQUERYTABLE',
    componentName: 'YQUERYTABLE',
    props: {
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
      this.refreshList()
    },
    methods: {
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
      refreshList(someParams = {}) {
        // TODO: 自动取消上一次接口
        if (this.loading) return
        this.loading = true
        const { currentPage, pageSize } = this.getPaginationProps(someParams)
        /**
         * TODO: 可以考虑 formValue 也传过去，实际调用层可以自己获取，不做也行
         */
        return this.serve({
          params: {
            currentPage,
            pageSize,
          },
        }).then(res => {
          this.loading = false
          this.list = res.data
          this.total = res.total
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
          columns: this.columns,
        },
        attrs: {
          ...this.$attrs,
          data: this.list,
        },
        on: tableEvents,
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
                  pageSize: this.pageParams.currentPage,
                  total: this.total,
                  disabled: this.loading,
                },
                on: paginationEvents,
              })
            }
          </div>
        </div>
      )
    }
  }

  return YQueryTable
}