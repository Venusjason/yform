import log from '../../core/lib/utils/log'

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
      onClick(e) {
        e.preventDefault()
        if (this.$listeners.onClick) {
          return this.$listeners.onClick(e)
        }
        if (this.do === 'submit') {
          this.loading = true
          this.YForm.onSubmit().then(() => {
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else if (this.do === 'search') {
          this.loading = true
          this.onSearch()
        } else if (this.do === 'debug') {
          console.log('表单值 : ')
          console.log(JSON.stringify(this.YForm.value, null, 2))
        }
      },
      onSearch() {
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
        this.loading = true
        latestQueryTable.refreshList().then(() => {
          this.loading = false
        }).catch(() => {
          this.loading = false
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

      return h(ButtonComponent, {
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
    }
  
  })

  YButton.install = function(Vue, options = {
    name: 'YButton'
  }) {
    Vue.component(options.name || YButton.name, YButton)
  }
  return YButton
}

export default createYButton()