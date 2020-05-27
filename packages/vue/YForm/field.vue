<script>
import { createField } from '../../core/lib/core/src/index'
import log from '../../core/lib/utils/log'
import LabelWrap from './label-wrap.vue'
import createInputComponent from './InputComponent.js'

const globalOptions = {
  defaultComponent: 'input',
}

const VueField = ({
  name: 'YFIELD',
  componentName: 'YFIELD',
  inject: ['YForm'],
  provide() {
    return {
      YField: this
    }
  },
  props: {
    name: {
      type: String,
      required: false
    },
    label: {},
    component: {
      default: globalOptions.defaultComponent,
    },
    /**
     * component style
     */
    componentStyle: {
      type: Object,
      default: () => ({}),
    },
    /**
     * component class
     */
    componentClass: {
      type: [Array, String, Object],
      default: () => []
    },
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
    inline: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: String,
      default: '',
    },

    // 表单域态 edit、preview、disabled
    fieldStatus: {
      type: String,
      default: 'edit',
      validator(value) {
        return ['edit', 'preview', 'disabled'].includes(value)
      },
    },
    // 自定义预览ui (value) => vnode
    previewValue: {
      type: Function,
    },
    /**
     * label 后缀
     */
    colon: {},
  },
  fieldInstance: null,
  data() {
    return {
      value: null,
      errorMsg: '',
      isNested: false,
      computedLabelWidth: '',
      InputComponent: null,
    }
  },
  computed: {
    rulesResult() {
      const rules = []
      if (this.required) {
        rules.unshift({ required: true, message: '该字段必填' })
      }
      rules.push(...(this.rules || []))
      return rules
    },
    isRequired() {
      return this.rulesResult.filter(rule => rule.required).length > 0
    },
    labelStyle() {
      const ret = {};
      if (!this.YForm) return ret
      const { labelPosition } = this.YForm
      if (labelPosition === 'top') return ret;
      const labelWidth = this.labelWidth || this.YForm.labelWidth
      if (labelWidth) {
        ret.width = labelWidth;
      }
      if (labelPosition !== 'top') {
        ret['textAlign'] = labelPosition
      }
      return ret;
    },
    contentStyle() {
      const ret = {};
      const label = this.label;
      if (this.YForm.labelPosition === 'top' || this.YForm.inline) return ret;
      if (!label && !this.labelWidth && this.isNested) return ret;
      const labelWidth = this.labelWidth || this.YForm.labelWidth;
      if (labelWidth === 'auto') {
        if (this.labelWidth === 'auto') {
          ret.marginLeft = this.computedLabelWidth;
        } else if (this.YForm.labelWidth === 'auto') {
          ret.marginLeft = this.YForm.autoLabelWidth;
        }
      } else {
        ret.marginLeft = labelWidth;
      }
      return ret;
    },
    isInline() {
      if (!this.YForm) return false
      return this.YForm.inline
    },
    fieldSize() {
      return this.YForm.size || 'small'
    },
    fieldColon() {
      const getcolon = (colon) => {
        if (typeof colon === 'boolean') {
          return colon ? '：' : ''
        } else {
          return colon
        }
      }
      if (this.colon === undefined) {
        return getcolon(this.YForm.colon)
      } else {
        return getcolon(this.colon)
      }
    },
    fieldValidateOnRuleChange() {
      return this.YForm.validateOnRuleChange
    },
    validateState() {
      // TODO: validating success error ''
      return this.errorMsg ? 'error' : 'success'
    },
    fieldClassNames() {
      return {
        'is-error': this.errorMsg !== '',
        'is-success': this.errorMsg === '',
        'is-required': this.isRequired,
        'is-no-asterisk': this.YForm && this.YForm.hideRequiredAsterisk,
        'is-inline': this.isInline,
        'mr4': this.isInline,
      }
    },
    // InputComponent() {
    //   return createInputComponent(this)
    // }
  },
  watch: {
    rulesResult: {
      deep: true,
      handler() {
        if (this.fieldValidateOnRuleChange) {
          log.help('rules 变化 立即执行校验')
          this.$options.fieldInstance.validate('')
        }
      }
    }
  },
  created() {
    this.initFieldInstance()
  },
  mounted() {
  },
  beforeDestroy() {
    this.$options.fieldInstance.beforeFieldDestory()
  },
  methods: {
    initFieldInstance() {
      const { formInstance } = this.YForm.$options
      const Field = createField(formInstance.id)
      this.$options.fieldInstance = new Field({
        name: this.name,
        label: this.label,
        rules: this.rulesResult,
      })

      const { fieldInstance } = this.$options
      fieldInstance.updateByInputChange = this.updateByInputChange
      fieldInstance.updateByChange = this.updateByChange
      fieldInstance.validateCallback = this.validateCallback
      this.InputComponent = createInputComponent(this)
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
    updateComputedLabelWidth(width) {
      this.computedLabelWidth = width ? `${width}px` : '';
    },
  },
  render(h) {
    return (
      <div class={{
        ...this.fieldClassNames,
        yfield: true,
      }}>
        {
          /**
           * 自动labelwidth 有问题的 this.labelStyle.width === 'auto'
           */
        }
        <LabelWrap
          isAutoWidth={this.labelStyle && this.labelStyle.width === 'auto'}
          updateAll={this.YForm.labelWidth === 'auto'}
        >
        {
          (this.label || this.$slots.label) && (
            <label for={this.name} style={this.labelStyle} class={{
              'yfield__label': true,
              [`size-${this.fieldSize}`]: true,
            }}>
              {this.label}{this.fieldColon}
            </label>
          )
        }
        </LabelWrap>
        <div class={{
          'yfield__content': true,
          'is-inline': this.isInline,
          [`size-${this.fieldSize}`]: true,
        }} style={this.contentStyle}>
          {
            h(this.InputComponent)
          }
          {
            this.errorMsg && (
              <div class="yfield__errors" >{this.errorMsg}</div>
            )
          }
        </div>
      </div>
    )
  },
})

VueField.install = function(Vue, options = {
  name: 'YField'
}) {
  Object.assign(globalOptions, options)
  Vue.component(globalOptions.name || VueField.name, VueField)
}

export default VueField
</script>

<style lang="less">
@import "./common.less";

.mr4 {
  margin-right: 4px;
}

.is-inline {
  display: inline-block;
}

.yfield {
  margin-bottom: 20px;

  &:before {
    display: table;
    content: "";
  }

  &:after {
    display: table;
    content: "";
    clear: both;
  }

  &.is-required:not(.is-no-asterisk) {
    .yfield__label:before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }

  .yfield__label {
    text-align: right;
    vertical-align: middle;
    float: left;
    color: #606266;
    padding: 0 12px 0 0;
    box-sizing: border-box;

    &.size-large {
      line-height: @size-large;
    }
    &.size-medium {
      line-height: @size-medium;
    }
    &.size-small {
      line-height: @size-small;
    }
    &.size-mini {
      line-height: @size-mini;
    }

  }

  .yfield__content {
    position: relative;
    font-size: 14px;

    &.size-large {
      line-height: @size-large;
    }
    &.size-medium {
      line-height: @size-medium;
    }
    &.size-small {
      line-height: @size-small;
    }
    &.size-mini {
      line-height: @size-mini;
    }

    &:before {
      display: table;
      content: "";
    }

    &:after {
      display: table;
      content: "";
      clear: both;
    }
  }

  .yfield__errors {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
}

</style>
