import log from '../../core/lib/utils/log'
import { getType, filterAttrs } from '../../core/lib/utils/index'

export const createYButton = (ButtonComponent = 'button') => {
  const YButton = ({
    name: 'YBUTTON',
    componentName: 'YBUTTON',
    latestQueryTable: null,
    props: {
      /**
       * TODO: 注意 与v1 版本默认值不兼容
       */
      // 按钮功能 可选值 submit / reset / 'search' / 'cancel'
      do: {
        type: String,
        required: false,
        default: 'submit',
        validator(value) {
          return ['submit', 'reset', 'search', 'cancel', 'debug'].indexOf(value) !== -1
        },
      },
      /**
       * 按钮点击前
       */
      beforeClick: {
        type: Function
      },
      afterClick: {
        type: Function
      }
    },
    computed: {
      YForm() {
        const getParentForm = (context) => {
          let parent = context.$parent
          let parentName = parent && parent.$options && parent.$options.componentName
          while (parentName !== 'YFORM') {
            parent = parent && parent.$parent
          }
          return parent
        }
        return getParentForm(this)
      },
      /**
       * TODO: 表单初始化时 可以用这个字段控制按钮状态
       */
      YFormDisabled() {
        return this.YForm && (this.YForm.formStatus === 'disabled')
      },
    },
    // watch: {
    //   YFormDisabled(value = false) {
    //     console.log(value)
    //     this.loading = value
    //   }
    // },
    data() {
      return {
        loading: false,
      }
    },
    methods: {
      setLatestQueryTable() {
        if (!this.$options.latestQueryTable) {
          const getLatestQueryTable = (context) => {
            if (!context) {
              return null
            }
            const nodes = (context && context.$children) || []

            let arr = nodes.filter(ele => (ele.$options.componentName === 'YQUERYTABLE'))

            if (arr.length === 0) {
              const nodes1 = nodes.filter(ele => !(ele.$options.componentName === 'YFIELD'))
              return nodes1.filter(ele => {
                return getLatestQueryTable(ele)
              })[0]
            } else {
              return arr[0]
            }
          }
          this.$options.latestQueryTable = getLatestQueryTable(this.YForm)
          if (!this.$options.latestQueryTable) {
            log.warn(`QueryTable 组件必须内置在 YForm组件内`)
          }
        }
      },
      onClick(e) {
        e && e.preventDefault()
        if (this.$listeners.click) {
          return this.$listeners.click(e)
        }
        this.beforeClick && this.beforeClick()
        if (this.loading || this.YFormDisabled) return
        if (this.do === 'submit') {
          this.onSubmit()
        } else if (this.do === 'search') {
          this.onSearch()
        } else if (this.do === 'debug') {
          log.help('表单值 : ')
          log.help(JSON.stringify(this.YForm.value, null, 2))
        } else if (this.do === 'reset') {
          this.onReset()
        }
      },
      onSubmit() {
        this.loading = true
        this.YForm.onSubmit().then(() => {
          this.loading = false
          this.afterClick && this.afterClick()
        }).catch(() => {
          this.loading = false
          this.afterClick && this.afterClick()
        })
      },
      /**
       * 一般手动执行查询 都会重置到第一页
       * @param {*} params 
       */
      onSearch(params = {
        toFirstPage: true
      }) {
        this.setLatestQueryTable()
        const aParams = {}
        if (params.toFirstPage) {
          aParams.currentPage = 1
        }
        this.loading = true
        this.$options.latestQueryTable.runServe(aParams).then(() => {
          this.loading = false
          this.afterClick && this.afterClick()
        }).catch(() => {
          this.loading = false
          this.afterClick && this.afterClick()
        })
      },
      onReset(params = {
        currentPage: 1
      }) {
        let a = null
        if (getType(params) === 'object') {
          a = params
        } else {
          a = {
            currentPage: params
          }
        }
        this.setLatestQueryTable()
        this.loading = true
        // 重置表单值
        this.YForm.resetFormValues()
        /**
         * 要v-model 先生效 form props.value 更新才能正确获取到formValues
         */
        setTimeout(() => {
          this.$options.latestQueryTable.runServe(a).then(() => {
            this.loading = false
            this.afterClick && this.afterClick()
          }).catch(() => {
            this.loading = false
            this.afterClick && this.afterClick()
          })
        })
      },
    },
    render(h) {
      let slotsDefault = ''
      let type = ''
      switch (this.do) {
        case 'search':
          slotsDefault = '查询'
          type = 'primary'
          break
        case 'reset':
          slotsDefault = '重置'
          break
        case 'cancel':
          slotsDefault = '取消'
          break
        case 'debug':
          slotsDefault = '打印'
          break
        default :
          slotsDefault = '提交'
          type = 'primary'
          break
      }

      const size = this.YForm.size

      const Btn = h(ButtonComponent, {
        props: {
          size,
          type,
          disabled: this.loading || this.YFormDisabled,
          loading: this.loading,
          ...this.$attrs,
        },
        attrs: filterAttrs({
          size,
          type,
          disabled: this.loading,
          ...this.$attrs,
        }),
        on: {
          ...this.$listeners,
          click: this.onClick,
        },
        key: String(Math.random() * 1000)
      }, [
        // this.loading ? 'loading' : '',
        this.$slots.default || slotsDefault,
      ])
      
      if (!this.YForm.$options.debug && this.do === 'debug') {
        return null
      }
      return Btn
    }
  
  })

  return YButton
}

export default createYButton()