import cloneDeep from 'lodash/cloneDeep'
import mergeWith from 'lodash/mergeWith'
import _get from 'lodash/get'
import _set from 'lodash/set'
import { Form } from '../../core/lib/core/src/index'
import log from '../../core/lib/utils/log'

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
    },
    formStatus: {
      type: String,
      default: 'edit',
      validator(value) {
        return ['edit', 'preview', 'disabled'].includes(value)
      },
    },
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
  updateFormValuesTimer: null,
  formValues: null,
  data() {
    return {
      name: '我是1',
      formValues: {},
      submiting: false,
      potentialLabelWidthArr: [],
      initialValues: {}
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
      this.initialValues = cloneDeep(this.value)
      this.$options.formInstance = new Form(this.value)
      const { formInstance } = this.$options
      // formInstance.updateFormValues(this.value)
      formInstance.afterFieldRegisterToForm = this.afterFieldRegisterToForm
    },
    /**
     * 表单重置
     */
    resetFormValues() {
      const value = cloneDeep(this.initialValues)
      this.$emit('input', value)
      this.$options.formInstance.updateFormValues(value)
    },
    afterFieldRegisterToForm(field) {
      // const { formInstance } = this.$options
      const value = _get(this.value, field.name)
      const formValues = mergeWith(
        cloneDeep(this.$options.formValues || {}),
        _set({}, field.name, value === undefined ? null : value)
      )
      // const formValues = cloneDeep(formInstance.getFormNewValues(field.name, value === undefined ? null : value))
      this.$options.formValues = formValues
      // this.$emit('input', formValues)
      // formInstance.updateFormValues(formValues)
      if (value === undefined) {
        /**
         * vue对未声明的属性无法自动更新,这里要确保所有注册的字段能够自动更新
         */
        // 要主动更新 core 层更新form.value
        // formInstance.updateFormValues(formValues)
      }
      if (this.$options.updateFormValuesTimer) {
        clearTimeout(this.$options.updateFormValuesTimer)
        this.$options.updateFormValuesTimer = null
      }
      /**
       * 保证 form 能最后一次更新
       */
      this.$options.updateFormValuesTimer = setTimeout(() => {
        // console.log('updateFormValuesTimer', formValues)
        // formInstance.updateFormValues(formValues)
        this.$emit('input', formValues)
      }, 0)
    },
    /**
     * 供外部调用 formValidate
     */
    async validate() {
      try {
        const res = await this.$options.formInstance.validate()
        this.$listeners.validate && this.$listeners.validate(true)
        return Promise.resolve(res)
      } catch(e) {
        log.error('validate fail', e)
        this.$listeners.validate && this.$listeners.validate(false, e)
        return Promise.reject(e)
      }
    },
    async onSubmit() {
      // 校验成功才会执行submit接口
      await this.validate()
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
      } else {
        log.warn(`请在 YForm 层 声明 onSubmit 才能与 <YButton do="submit" /> 联动`)
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

export default VueForm