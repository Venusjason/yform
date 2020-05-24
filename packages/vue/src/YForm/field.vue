<script>
import { Vue } from 'vue-property-decorator'
import { createField } from '../../../core/lib/core/src/index'
import LabelWrap from './label-wrap.vue'

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
    inline: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: String,
    },
    size: {
      type: String,
      // validator(value) {
      //   return ['large', 'medium', 'small', 'mini'].includes(value)
      // },
    },
  },
  fieldInstance: null,
  data() {
    return {
      value: null,
      errorMsg: '',
      isNested: false,
    }
  },
  computed: {
    YForm() {
      const getParentForm = (context) => {
        let parent = context.$parent
        let parentName = parent && parent.$options && parent.$options.componentName
        while (parentName !== 'YFORM') {
          if (parentName === 'YFIELD') {
            this.isNested = true
          }
          parent = parent && parent.$parent
        }
        return parent
      }
      return getParentForm(this)
    },
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
      if (!this.YForm) return this.size || 'small'
      return this.size || this.YForm.size || 'small'
    }
  },
  watch: {
    rulesResult: {
      deep: true,
      handler(value) {
        console.log(`${this.name}的rule 更新`, value)
      }
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
      this.$options.fieldInstance = new Field({
        name: this.name,
        label: this.label,
        rules: this.rulesResult,
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
    updateComputedLabelWidth(width) {
      this.computedLabelWidth = width ? `${width}px` : '';
    },
  },
  render(h) {
    const _this = this


    return (
      <div class={{
        yfield: true,
        'is-error': this.errorMsg !== '',
        'is-success': this.errorMsg === '',
        'is-required': this.isRequired,
        'is-no-asterisk': this.YForm && this.YForm.hideRequiredAsterisk,
        'is-inline': this.isInline,
        'mr4': this.isInline,
      }}>
        {
          /**
           * 自动labelwidth 有问题的 this.labelStyle.width === 'auto'
           */
        }
        <LabelWrap
          isAutoWidth={this.labelStyle && this.labelStyle === 'auto'}
          updateAll={this.YForm.labelWidth === 'auto'}
        >
        {
          (this.label || this.$slots.label) && (
            <label for={this.name} style={this.labelStyle} class={{
              'yfield__label': true,
              [`size-${this.fieldSize}`]: true,
            }}>
              <slot name="label">{this.label}</slot>
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
              <div class="yfield__errors" >{this.errorMsg}</div>
            )
          }
        </div>
      </div>
    )
  },
})
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
  margin-top: 20px;

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
