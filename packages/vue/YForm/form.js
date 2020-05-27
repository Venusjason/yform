import cloneDeep from 'lodash/cloneDeep'
import { Form } from '../../core/lib/core/src/index'

const VueForm = ({
  name: 'YFORM',
  componentName: 'YFORM',
  provide() {
    return {
      YForm: this
    }
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    /**
     * 是否走悲观校验，遇到第一个校验失败就停止后续校验
     */
    validateFirst: {
      type: Boolean,
      default: false,
    },
    /**
     * 行内表单模式
     */
    inline: {
      type: Boolean,
      default: false,
    },
    /**
     * 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width
     */
    labelPosition: {
      type: String,
      default: 'right',
      validator(value) {
        return ['right', 'left', 'top'].includes(value)
      },
    },
    labelWidth: {
      type: String,
    },
    /**
     * 表单尺寸
     */
    size: {
      type: String,
      default: 'small',
      validator(value) {
        return ['large', 'medium', 'small', 'mini'].includes(value)
      },
    },
    /**
     * 是否隐藏required 前的 *
     */
    hideRequiredAsterisk: {
      type: Boolean,
      default: false
    },
    /**
     * label 后缀
     */
    colon: {
      type: [Boolean, String],
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否在 rules 属性改变后立即触发一次验证
     */
    validateOnRuleChange: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    autoLabelWidth() {
      if (!this.potentialLabelWidthArr.length) return 0;
      const max = Math.max(...this.potentialLabelWidthArr);
      return max ? `${max}px` : '';
    }
  },
  watch: {
    value: {
      deep: true,
      handler: function (val) {
        this.$options.formInstance.updateFormValues(val)
      }
    }
  },
  formInstance: null,
  data() {
    return {
      name: '我是1',
      formValues: {},
      submiting: false,
      potentialLabelWidthArr: [],
    }
  },
  created() {
    this.initForm()
  },
  mounted() {
    // this.$options.formInstance.updateFormValues(this.value)
  },
  beforeDestroy() {
    this.$options.formInstance.beforeDestroy()
  },
  methods: {
    initForm() {
      this.$options.formInstance = new Form(this.value)
      const { formInstance } = this.$options
      // formInstance.updateFormValues(this.value)

      formInstance.afterFieldRegisterToForm = this.afterFieldRegisterToForm
    },
    afterFieldRegisterToForm(field) {
      const { formInstance } = this.$options
      const value = formInstance.getFieldValue(field.name)
      // 只有最后一次注册的字段被收入了
      // const formValues = formInstance.getFormNewValues(field.name, value === undefined ? null : value)
      //   this.$emit('input', formValues)
      if (value === undefined) {
        /**
         * vue对未声明的属性无法自动更新,这里要确保所有注册的字段能够自动更新
         */
        const formValues = formInstance.getFormNewValues(field.name, null)
        this.$emit('input', formValues)
        // 要主动更新 core 层更新form.value
        formInstance.updateFormValues(formValues)
      }
    },
    async onSubmit() {
      await this.$options.formInstance.validate()
      if (this.$listeners.submit) {
        this.submiting = true
        const formValues = cloneDeep(this.value)
        try {
          await this.$listeners.submit(formValues)
          this.submiting = false
          return Promise.resolve({
            submitResult: 'success',
            submiting: this.submiting,
          })
        } catch (e) {
          this.submiting = false
          return Promise.reject({
            submitResult: 'error',
            submiting: this.submiting,
          })
        }
      }
    },

    getLabelWidthIndex(width) {
      const index = this.potentialLabelWidthArr.indexOf(width);
      // it's impossible
      if (index === -1) {
        throw new Error('[YForm] unpected width ', width);
      }
      return index;
    },

    registerLabelWidth(val, oldVal) {
      if (val && oldVal) {
        const index = this.getLabelWidthIndex(oldVal);
        this.potentialLabelWidthArr.splice(index, 1, val);
      } else if (val) {
        this.potentialLabelWidthArr.push(val);
      }
    },
    deregisterLabelWidth(val) {
      const index = this.getLabelWidthIndex(val);
      this.potentialLabelWidthArr.splice(index, 1);
    }
  },
  render(h) {
    // const { $attrs, $listeners } = this
    // const _this = this
    return h('form', {
      props: {
        ...this.$attrs,
      },
      attrs: this.$attrs,
      ref: 'yform',
    }, [
      this.$slots.default,
      // (<div>{this.$options.formInstance.id}</div>),
      // <pre>value: {JSON.stringify(this.value, null, 2)}</pre>,
    ])
  },
})

VueForm.install = function(Vue, options = {
  name: 'YForm'
}) {
  Vue.component(options.name || VueForm.name, VueForm)
}

export default VueForm