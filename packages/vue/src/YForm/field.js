import { Vue } from 'vue-property-decorator'
import { createField } from '../../../core/lib/core/src/index'

export default Vue.extend({
  name: 'YFIELD',
  componentName: 'YFIELD',
  props: {
    name: {
      type: String,
      required: false
    },
    label: {},
    component: {},
    /**
     * 是否html原生控件
     */
    yNative: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否必填
     */
    required: {
      type: Boolean,
      default: false,
    },
    rules: {},
  },
  fieldInstance: null,
  data() {
    return {
      value: null,
      errorMsg: '',
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
    }
  },
  mounted() {
    this.initFieldInstance()
  },
  beforeDestroy() {
    this.$options.fieldInstance.beforeFieldDestory()
  },
  methods: {
    initFieldInstance() {
      const { formInstance } = this.YForm.$options
      const Field = createField(formInstance.id)
      const rules = []
      if (this.required) {
        rules.unshift({ required: true, message: '该字段必填' })
      }
      rules.push(...(this.rules || []))
      this.$options.fieldInstance = new Field({
        name: this.name,
        label: this.label,
        rules,
      })

      const { fieldInstance } = this.$options
      fieldInstance.updateByInputChange = this.updateByInputChange
      fieldInstance.updateByChange = this.updateByChange
      fieldInstance.validateCallback = this.validateCallback
    },
    updateByInputChange(value) {
      this.value = value
    },
    updateByChange(value) {
      this.value = value
    },
    validateCallback(result) {
      this.errorMsg = result.errorMsg
    },
  },
  render(h) {
    const _this = this

    return (
      <div>
        <div>{this.name}:{this.value}</div>
        <div>
          <label for={this.name} >{this.label}</label>
          {
            h(this.component, {
              props: {
                ...this.$attrs,
                value: this.value,
              },
              attrs: {
                ...this.$attrs,
                value: this.value,
              },
              on: {
                ...this.$listeners,
                input(e) {
                  let value = e
                  /**
                   * 原生事件
                   */
                  if (_this.yNative) {
                    value = e.target.value
                  }
                  _this.$options.fieldInstance.onFieldInputChange(value)
                },
              }
            })
          }
          {
            this.errorMsg && (
              <span style="color: red" >{this.errorMsg}</span>
            )
          }
        </div>
      </div>
    )
  },
})