import log from '../../core/lib/utils/log'
import { isDevelopment, getType } from '../../core/lib/utils/index'

export const createYButton = (ButtonComponent = 'button') => {
  let latestQueryTable = null
  const YButton = ({
    name: 'YBUTTON',
    componentName: 'YBUTTON',
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
        if (!latestQueryTable) {
          const getLatestQueryTable = (context) => {
            let parent = context.$parent
            let children = parent.$children || []
            let matchedTable = children.filter(child => {
              return child && child.$options && ((child.$options.componentName === 'YQUERYTABLE' || child.$options.name === 'YQUERYTABLE'))
            })

            if (matchedTable.length === 0) {
              if (!parent) {
                log.warn('button do=search 需要搭配QueryTable才能使用')
                return null
              }
              return getLatestQueryTable(parent)
            }

            return matchedTable[0]
          }
          latestQueryTable = getLatestQueryTable(this)
        }
      },
      onClick(e) {
        e && e.preventDefault()
        if (this.$listeners.click) {
          return this.$listeners.click(e)
        }
        this.beforeClick && this.beforeClick()
        if (this.do === 'submit') {
          this.loading = true
          this.YForm.onSubmit().then(() => {
            this.loading = false
            this.afterClick && this.afterClick()
          }).catch(() => {
            this.loading = false
            this.afterClick && this.afterClick()
          })
        } else if (this.do === 'search') {
          this.loading = true
          this.onSearch()
        } else if (this.do === 'debug') {
          log.help('表单值 : ')
          log.help(JSON.stringify(this.YForm.value, null, 2))
        } else if (this.do === 'reset') {
          this.onReset()
        }
      },
      onSearch() {
        this.setLatestQueryTable()
        this.loading = true
        latestQueryTable.refreshList().then(() => {
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
          latestQueryTable.refreshList(a).then(() => {
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
        attrs: {
          size,
          type,
          disabled: this.loading,
          ...this.$attrs,
        },
        on: {
          ...this.$listeners,
          click: this.onClick,
        }
      }, [
        // this.loading ? 'loading' : '',
        this.$slots.default || slotsDefault,
      ])
      
      if (!isDevelopment && this.do === 'debug') {
        return null
      }
      return Btn
    }
  
  })

  return YButton
}

export default createYButton()