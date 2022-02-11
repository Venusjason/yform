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

  // let id = 0

  const {
    Table,
    PaginationComponent,
    isDasherize = true,
  } = props

  const YQueryTable = {
    name: 'YQUERYTABLE',
    componentName: 'YQUERYTABLE',
    globalOptions: {},
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
          return ['right', 'left', 'center'].includes(value)
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
      },
      // 手动调用serve，默认false
      manual: {
        type: Boolean,
        default: false,
      },
    },
    inject: ['YForm'],
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
        globalOptionsPagination: {},
        tableRef: null,
      }
    },
    created() {
      const { pagination = {} } = this.$options.globalOptions
      const { currentPage = 1, pageSize = 10, ...globalOptionsPagination } = pagination
      Object.assign(this.pageParams, {
        currentPage,
        pageSize,
      })
      this.globalOptionsPagination = globalOptionsPagination

      this.YForm && this.YForm.queryTableRegister(this)
    },
    mounted() {
      // id++
      this.tableRef = this.$refs.table.$refs.YTable
      this.wrappedTableRef && this.wrappedTableRef(this.tableRef)
      if (!this.manual || this.manual === undefined) {
        this.refreshList()
      }
    },
    beforeDestory() {
      this.YForm && this.YForm.queryTableDestory(this)
    },
    methods: {
      getPaginationProps(someParams = {}) {
        const defaultPaginationProps = {
          pageSizes: [10, 20, 50, 100],
          layout: 'total, sizes, prev, pager, next, jumper',
          total: 0,
        }
        return {
          ...defaultPaginationProps,
          ...this.pageParams,
          ...this.globalOptionsPagination,
          ...(this.pagination || {}),
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
        // fix: size变化，但data里的 page size 在接口请求完毕才更新值，这时size * currentPage > total，el-pagination 自动将currentPage 调整为最大分页值而自动并触发了 onCurrentChange
        // 将 total = 0 这个比较将失效
        this.total = 0
        this.paginationMethodsIntercept('onSizeChange')(pageSize).then(() => {
          this.refreshList({
            currentPage: 1,
            pageSize
          }).then((res) => {
            const {
              on: paginationOn = {},
            } = getEvents(this.getPaginationProps())
            const { sizeChangeSuccess } = paginationOn
            sizeChangeSuccess && sizeChangeSuccess(pageSize, res)
          })
        })
      },
      handleCurrentChange(currentPage) {
        this.paginationMethodsIntercept('onCurrentChange')(currentPage).then(() => {
          this.refreshList({ currentPage }).then(res => {
            const {
              on: paginationOn = {},
            } = getEvents(this.getPaginationProps())
            const { currentChangeSuccess } = paginationOn
            currentChangeSuccess && currentChangeSuccess(currentPage, res)
          })
        })
      },
      async refreshList(someParams = {}) {
        // TODO: 自动取消上一次接口
        if (this.loading) return
        // 默认在这里走了 form 校验
        await this.YForm.validate()
        this.loading = true
        const { currentPage, pageSize } = this.getPaginationProps(someParams)
        const formValues = this.YForm._getFormVales()
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
          // this.refreshPaginationForUi()
          const resToOut = {
            total: this.total,
            list: this.list,
            currentPage,
            pageSize,
          }
          this.$nextTick(() => {
            const tableRef = this.$refs && this.$refs.table && this.$refs.table.$refs && this.$refs.table.$refs.YTable
            if (tableRef && this.tableRef !== tableRef) {
              this.tableRef = tableRef
              this.wrappedTableRef && this.wrappedTableRef(tableRef)
            }
          })
          this.$emit('refreshListCb', resToOut)
          return Promise.resolve(resToOut)
        }).catch(e => {
          log.error(e)
          this.loading = false
          // 修复 element 在分页控件上的问题，element应该是以交互优先
          // 如点击2 2页接口挂掉，其实需要回退到上一页的页码高亮，erlement 还是2
          this.refreshPaginationForUi()
          this.$nextTick(() => {
            const tableRef = this.$refs && this.$refs.table && this.$refs.table.$refs && this.$refs.table.$refs.YTable
            if (tableRef && this.tableRef !== tableRef) {
              this.tableRef = tableRef
              this.wrappedTableRef && this.wrappedTableRef(tableRef)
            }
          })
          return Promise.reject(e)
        })
      },
      // public api
      runServe(...args) {
        return this.refreshList(...args)
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
      } = getEvents(this.getPaginationProps())
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
        attrs: ({
          ...this.$attrs,
          data: this.list,
        }),
        on: tableEvents,
        // key: this.uniqueKey || String(id),
        ref: 'table'
      }, this.$slots.default || this.$slots.columns)

      const onPageChange = {
        'size-change': i => this.handleSizeChange(i),
        'current-change': i => this.handleCurrentChange(i),
      }

      const paginationEvents = {
        ...paginationOn,
        ...onPageChange,
      }

      // TODO: V-loading 需要接入层提前实现
      return (
        <div v-loading={this.loading && this.showLoading}>
          <div>
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
                  pageSize: this.pageParams.pageSize,
                  ...paginationRest,
                  currentPage: this.pageParams.currentPage,
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
