import { Vue } from 'vue-property-decorator'
import { Form } from '../../../core/lib/core/src/index'

export default Vue.extend({
  name: 'YFORM',
  componentName: 'YFORM',
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
  formInstance: new Form(),
  data() {
    return {
      name: '我是1',
      formValues: {}
    }
  },
  created() {
    this.initForm()
  },
  mounted() {
  },
  beforeDestroy() {
    this.$options.formInstance.beforeDestroy()
  },
  methods: {
    initForm() {
      const { formInstance } = this.$options
      formInstance.updateFormValues(this.value)
      // formInstance.afterValueUpdate = (value) => {
      //   // console.log('afterValueUpdate', value)
      //   // this.$emit('input', value)
      // }

      formInstance.afterFieldRegisterToForm = this.afterFieldRegisterToForm
    },
    afterFieldRegisterToForm(field) {
      const { formInstance } = this.$options
      const value = formInstance.getFieldValue(field.name)
      if (value === undefined) {
        /**
         * vue对未声明的属性无法自动更新,这里要确保所有注册的字段能够自动更新
         */
        const formValues = formInstance.getFormNewValues(field.name, null)
        this.$emit('input', formValues)
      }
    }
  },
  render(h) {
    const { $attrs } = this
    return h('form', {
      props: {
        ...$attrs,
      },
      attrs: $attrs,
      ref: 'yform',
    }, [
      this.$slots.default,
      (<div>{this.$options.formInstance.id}</div>),
      <pre>value: {JSON.stringify(this.value, null, 2)}</pre>,
    ])
  },
})