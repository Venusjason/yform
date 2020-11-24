import log from '../../core/lib/utils/log'
import { getType, filterAttrs } from '../../core/lib/utils/index'

export const createYButton = (ButtonComponent = 'button') => {
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
      },
    },
    inject: ['YForm'],
    computed: {
      // YForm() {
      //   const getParentForm = (context) => {
      //     if (!context) {
      //       return null
      //     }
      //     let parent = context.$parent
      //     console.log('button parent', parent);
      //     let parentName = parent && parent.$options && parent.$options.componentName
      //     if (parentName !== 'YFORM') {
      //       return getParentForm(parent && parent.$parent)
      //     } else {
      //       return parent
      //     }
      //   }

      //   let yform = getParentForm(this)
      //   if (!yform) {
      //     // button 与 form 没有父子关系 使用 y-scope
      //     const getYScopeNode = (context) => {
      //       if (!context) return
      //       if (context._vnode && context._vnode.data && context._vnode.data.attrs && (context._vnode.data.attrs.yScope || context._vnode.data.attrs['y-scope'])) {
      //         return context
      //       } else {
      //         return getYScopeNode(context.$parent)
      //       }
      //     }
      //     const YScopeNode = getYScopeNode(this)
      //     const findYformNode = (c) => {
      //       let componentName = c && c.$options && c.$options.componentName
      //       return componentName === 'YFORM'
      //     }
      //     // 二叉树查找
      //     const SearchNode = (context, arr = [YScopeNode]) => {
      //       if (findYformNode(context)) {
      //         arr.push(context)
      //         return arr
      //       }
      //       for (let i in context.$children) {
      //         const child = context.$children[i]
      //         if (arr.indexOf(child) < 0) {
      //           arr.push(child)
      //           if (findYformNode(child)) {
      //             return arr
      //           } else {
      //             return SearchNode(child, arr)
      //           }
      //         }
      //       }
      //     }
      //     const nodes = SearchNode(YScopeNode)
      //     const node = nodes && nodes.length > 0 && nodes[nodes.length - 1]
      //     YScopeNode && console.log('getChildYform', nodes, node)
      //     yform = node
      //   }
      //   return yform
      // },
      /**
       * TODO: 表单初始化时 可以用这个字段控制按钮状态
       */
      YFormDisabled() {
        return this.YForm && (this.YForm.formStatus === 'disabled')
      },
      buttonDisabled() {
        const hasDisabled = Object.prototype.hasOwnProperty.call(this.$attrs, 'disabled')
        return hasDisabled ? this.$attrs.disabled : this.YFormDisabled
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
        e && e.preventDefault()
        if (this.$listeners.click) {
          return this.$listeners.click(e)
        }
        this.beforeClick && this.beforeClick()
        if (this.loading || this.buttonDisabled) return
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
        const aParams = {}
        if (params.toFirstPage) {
          aParams.currentPage = 1
        }
        this.loading = true
        Promise.all(
          this.YForm.childrenQueryTable.map(queryTable => queryTable.runServe(aParams))
        ).finally(() => {
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
        this.loading = true
        // 重置表单值
        this.YForm.resetFormValues()
        /**
         * 要v-model 先生效 form props.value 更新才能正确获取到formValues
         */
        setTimeout(() => {
          Promise.all(
            this.YForm.childrenQueryTable.map(queryTable => queryTable.runServe(a))
          ).finally(() => {
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

      const size = this.YForm.formSize

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
      
      if (!log.getIsDebug() && this.do === 'debug') {
        return null
      }
      return Btn
    }
  
  })

  return YButton
}

export default createYButton()