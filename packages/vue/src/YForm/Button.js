import { Vue } from 'vue-property-decorator'

export const createYButton = (ButtonComponent = 'button') => {
  return Vue.extend({
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
          return ['submit', 'reset', 'search', 'cancel'].indexOf(value) !== -1
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
      loading() {
        return this.YForm.submiting
      },
    },
    methods: {
      onClick(e) {
        e.preventDefault()
        if (this.$listeners.onClick) {
          return this.$listeners.onClick(e)
        }
        if (this.do === 'submit') {
          this.YForm.onSubmit()
        }
      }
    },
    render(h) {
      let slotsDefault = ''
      switch (this.do) {
        case 'search':
          slotsDefault = '查询'
          break
        case 'reset':
          slotsDefault = '重置'
          break
        case 'cancel':
          slotsDefault = '取消'
          break
        default :
          slotsDefault = '提交'
      }
      return h(ButtonComponent, {
        props: {
          disabled: this.loading,
          loading: this.loading,
          ...this.$attrs,
        },
        attrs: {
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
}

export default createYButton()