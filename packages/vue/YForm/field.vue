<script>
import isEqualWith from 'lodash/isEqualWith'
import AsyncValidator from 'async-validator'
import InputComponent from './InputComponent.js'
import { computedRules } from './rules.js'
import log from '../../core/lib/utils/log'
import { getType, filterAttrs } from '../../core/lib/utils/index'
import LabelWrap from './label-wrap.vue'

const globalOptions = {
  name: 'YField',
  defaultComponent: 'input',
}

const VueField = {
  name: 'YFIELD',
  componentName: 'YFIELD',
  globalOptions: {
    ...globalOptions,
  },
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
    yList: {
      type: Boolean,
      default: false,
    },
    component: {
    },
    /**
     * component style 支持css内联字符串
     */
    componentStyle: {
      type: [Object, String],
      default: () => ({}),
    },
    /**
     * component class
     */
    componentClass: {
      type: [Array, String, Object],
      default: () => []
    },
    componentProps: {
      default: () => ({})
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
      required: false,
      default: undefined,
    },
    labelWidth: {
      type: String,
      default: '',
    },

    // 表单域态 edit、preview、disabled
    fieldStatus: {
      type: String,
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
    dataSource: {},
    // 返回 component 实例
    wrappedComponentRef: {
      type: Function,
      required: false,
    },
    // 控制字段渲染
    yVisible: {
      type: Boolean,
      default: true,
    },
    validateOnRuleChange: {
      type: Boolean,
      required: false,
    },
    /**
     * 表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width
     */
    labelPosition: {
      type: String,
      required: false,
      validator(value) {
        return ['right', 'left', 'top'].includes(value)
      },
    },
  },
  data() {
    return {
      trigger: '',
      validateState: '',
      validateMessage: '',
      errorMsg: '',
      rulesResultChangeCount: 0,
    }
  },
  computed: {
    value: {
      get: function() {
        return this.YForm && this.YForm.getFieldValue(this.name)
      },
      set: function() {

      }
    },
    isRequired() {
      return this.rulesResult.filter(rule => rule.required).length > 0
    },
    rulesResult() {
      const rules = computedRules(this.rules, this.label)
      if (this.required) {
        rules.unshift(...computedRules('required', this.label))
      }
      return rules
    },
    dataSourceSlots() {
      return this.dataSource || []
    },
    labelPositionResult() {
      return this.labelPosition || this.YForm.labelPosition
    },
    labelStyle() {
      const ret = {};
      if (!this.YForm) return ret
      const { labelPositionResult } = this
      if (labelPositionResult === 'top') return ({ width: '100%', textAlign: 'left', display: 'block' })
      const labelWidth = this.labelWidth || this.YForm.labelWidth
      if (labelWidth) {
        ret.width = labelWidth;
        // label 默认设置 inline-block,因为 inline = true 时,label-width作用在display:inline上无效
        ret.display = 'inline-block'
      }
      if (labelPositionResult !== 'top') {
        ret['textAlign'] = labelPositionResult
      }
      return ret;
    },
    contentStyle() {
      const ret = {};
      const label = this.label;
      // top || inline 
      if (this.labelPositionResult === 'top' || this.isInline) return ret;
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
      let inline = false
      if ([true, false].includes(this.inline)) {
        inline = this.inline
      } else {
        if (!this.YForm) {
          inline = false
        } else {
          inline = this.YForm.inline
        }
      }
      return inline
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
      // 优先级 field.fieldValidateOnRuleChange > YForm.validateOnRuleChange
      if (this.validateOnRuleChange !== undefined) {
        return this.validateOnRuleChange
      } else {
        return this.YForm.validateOnRuleChange
      }
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
  },
  watch: {
    value: {
      deep: true,
      handler: function (val, oldVal) {
        if (!isEqualWith(val, oldVal)) {
          // 执行校验
          if (oldVal !== undefined) {
            this.validate(this.trigger)
          }
        }
      }
    },
    yVisible: {
      immediate: true,
      handler: function(val) {
        if (val) {
          this.initField()
        } else {
          this.YForm.EM.emit('FIELD_DESTORY', this)
        }
      }
    },
  },
  created() {
    this.initField()
  },
  mounted() {
    const _this = this
    this.$watch('rulesResult', function() {
      if (_this.rulesResultChangeCount === 0) {
        // 初始化 不走校验
        _this.rulesResultChangeCount++
        return
      }
      _this.rulesResultChangeCount++
      if (_this.fieldValidateOnRuleChange) {
        _this.validate(_this.trigger)
      }
    }, {
      deep: true,
      immediate: false,
    })
  },
  beforeDestroy() {
    this.YForm.EM.emit('FIELD_DESTORY', this)
  },
  methods: {
    initField() {
      const { EM } = this.YForm
      EM.emit('FIELD_REGISTER', this)
    },
    updateAfter(trigger = '') {
      this.trigger = trigger
    },
    getFilteredRule(trigger) {
      return this.rulesResult.filter(rule => {
        if (!rule.trigger || trigger === '') {
          return true
        }
        if (getType(rule.trigger) === 'array') {
          return rule.trigger.indexOf(trigger) > -1
        } else {
          return rule.trigger === trigger
        }
      })
    },
    validate(trigger = '', callback) {
      const { value } = this
      const rules = this.getFilteredRule(trigger)
      if (rules.length === 0) {
        this.clearValidate()
        callback && callback()
        return true
      }
      const descriptor = {}
      descriptor[this.name] = rules.map(rule => {
        // eslint-disable-next-line
        const { trigger: t, ...rest } = rule
        // log.help('trigger', t)
        return {
          ...rest
        }
      })
      this.validateState = 'validating'
      const validator = new AsyncValidator(descriptor)
      const model = {}
      model[this.name] = value
      validator.validate(
        { [this.name]: value },
        { firstFields: true },
        (errors, invalidFields) => {
          this.validateState = errors ? 'error' : 'success'
          this.errorMsg = this.validateMessage = errors ? errors[0].message : ''
          this.validateState === 'error' && log.warn(`${this.name}: ${this.validateMessage}`)
          callback && callback(this.validateMessage, invalidFields)
        }
      )
    },
    clearValidate() {
      this.errorMsg = ''
      this.validateState = ''
      this.validateMessage = ''
    },
    updateComputedLabelWidth(width) {
      this.computedLabelWidth = width ? `${width}px` : '';
    },
    actionFun() {
      return {
        add: (data)=>{
          this.value.push(data)
        },
        delete: (index)=>{
          this.value.splice(index, 1);
        },
        onMove: (dir, index) => {
          let moveComm = (curIndex, nextIndex) => {
            let arr = this.value
            arr[curIndex] = arr.splice(nextIndex, 1, arr[curIndex])[0]
            return arr
          }
          if (dir === 'up' && index === 0) {
            this.$message.warning('已在顶部！')
          } else if (dir === 'down' && index === this.value.length - 1) {
            this.$message.warning('已在底部！')
          } else {
            let nextIndex = dir === 'up' ? index - 1 : index + 1
            this.value = moveComm(index, nextIndex)
          }
          return true
        }
      }
    }
  },
  render(h) {
    return this.yVisible ? h('div', {
      class: {
        ...this.fieldClassNames,
        yfield: true,
      },
      key: this.name,
    }, [
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
            {this.label || this.$slots.label}{this.fieldColon}
          </label>
        )
      }
      </LabelWrap>,
      <div class={{
        'yfield__content': true,
        'is-inline': this.isInline,
        [`size-${this.fieldSize}`]: true,
      }} style={this.contentStyle} key={this.name}>
        {
          !this.yList
          ? <InputComponent />
          : this.$scopedSlots.default({ value: this.value, action: this.actionFun() })
        }
        {
          this.errorMsg && (
            <div class="yfield__errors" >{this.errorMsg}</div>
          )
        }
      </div>
    ]) : null
  },
}

export default VueField

export const FieldList = ({
  name: 'YFieldList',
  render(h) {
    return h(VueField, {
      props: {
        yList: true,
        ...this.$attrs
      },
      attrs: filterAttrs({
        ...this.$attrs,
      }),
      on: {
        ...this.$listeners,
      },
      scopedSlots: { // 作用域透传
        default: (props) => {
          return h('div', [
            this.$scopedSlots.default(props),
          ])
        }
      },
    })
  }
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
  margin-bottom: 20px!important;

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

  &.is-inline {
    // 解决 safari inline label 与 content 换行问题
    .yfield__label {
      float: none;
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
