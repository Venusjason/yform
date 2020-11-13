<script>
import isEqualWith from 'lodash/isEqualWith'
import cloneDeep from 'lodash/cloneDeep'
import mergeWith from 'lodash/mergeWith'
import _set from 'lodash/set'
import _get from 'lodash/get'
import EventEmiter from '../../core/lib/core/src/EventEmiter.js'
import log from '../../core/lib/utils/log'
import { getType, filterAttrs } from '../../core/lib/utils/index'

export default {
  name: 'YFORM',
  componentName: 'YFORM',
  provide() {
    return {
      YForm: this
    }
  },
  globalOptions: {
    name: 'YForm',
    size: 'small',
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
      default: false,
    },
    formStatus: {
      type: String,
      default: 'edit',
      validator(value) {
        return ['edit', 'preview', 'disabled'].includes(value)
      },
    },
    /**
     * 表单提交是是否需要定位到未通过校验的元素
     */
    scrollToFirstError: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    autoLabelWidth() {
      if (!this.potentialLabelWidthArr.length) return 0;
      const max = Math.max(...this.potentialLabelWidthArr);
      return max ? `${max}px` : '';
    },
    events() {
      const events = {}
      Object.keys(this.$listeners).forEach(name => {
        if (name !== 'input') {
          events[name] = this.$listeners[name]
        }
      })
      return events
    },
    formSize() {
      return this.size || this.$options.globalOptions.size
    },
  },
  data() {
    return {
      initialValues: {},
      fields: [],
      EM: null,
      formValuesA: {},
      submiting: false,
      potentialLabelWidthArr: [],
      count: 0,
    }
  },
  childrenQueryTable: [],
  watch: {
    value: {
      deep: true,
      // immediate: true,
      handler: function (val) {
        // console.log('form value 更新', cloneDeep(val))
        this.formValuesA = cloneDeep(val)
        if (this.count === 0) {
          this.initialValues = cloneDeep(val)
        }
        this.count++
      }
    }
  },
  created() {
    this.initForm()
  },
  mounted() {
  },
  beforeDestroy () {
    const LIFE_CYCLES = [
      'FIELD_REGISTER',
      'FIELD_INPUT_CHANGE',
      'FIELD_INPUT_FOCUS',
      'FIELD_INPUT_BLUR',
      'FIELD_DESTORY',
    ]
    LIFE_CYCLES.forEach(ELE => this.EM.off(ELE))
  },
  methods: {
    initForm() {
      const EM = new EventEmiter()
      EM.on('FIELD_REGISTER', this._fieldRegister)
      EM.on('FIELD_INPUT_CHANGE', this._fieldInputChange)
      EM.on('FIELD_INPUT_FOCUS', this._fieldInputFocus)
      EM.on('FIELD_INPUT_BLUR', this._fieldInputBlur)
      EM.on('FIELD_DESTORY', this._fieldDestory)
      this.EM = EM
    },
    /**
     * 字段注册
     * 区分 virtualField / field
     */
    _fieldRegister(field) {
      if (this.fields[field.name]) {
        this.fields[field.name].push(field)
      } else {
        this.fields[field.name] = [field]
      }
      // 字段初始化
      // 判断 , 拆分name
      const value = this.getFieldValue(field.name)
      if (field.name.includes(',')) {
        const names = field.name.split(',')
        const namesValue = names.map(nameItem => {
          return this.getFieldValue(nameItem)
        })
        _set(this.formValuesA, field.name, namesValue)
      } else {
        _set(this.formValuesA, field.name, value === undefined ? null : value)
      }
      mergeWith(this.formValuesA, this.value)
      const newVal = cloneDeep(this.formValuesA)
      this.$emit('input', newVal)
    },
    _fieldInputChange({ field, value }) {
      if (!isEqualWith(field.value, value)) {
        this.notifyField(field.name, 'change', true)
        this.setFieldValue(field.name, value)
      }
    },
    _fieldInputFocus({ field }) {
      this.notifyField(field.name, 'focus', true)
    },
    _fieldInputBlur({ field }) {
      this.notifyField(field.name, 'blur', true)
    },
    _fieldDestory(field) {
      if (field.name) {
        this.fields[field.name] = this.fields[field.name].filter(f => f !== field)
      }
      if (this.fields[field.name].length === 0) {
        delete this.fields[field.name]
      }
    },
    getFieldValue(name) {
      return _get(this.value, name)
    },
    // 返回form 过滤值
    _getFormVales() {
      const filterNames = (data) => {
        if (getType(data) === 'object') {
          let obj = {}
          Object.keys(data).forEach(key => {
            if (!key.includes(',')) {
              if (typeof data[key] === 'object') {
                obj[key] = filterNames(data[key])
              } else {
                obj[key] = data[key]
              }
            } else {
              const names = key.split(',')
              names.forEach((name, i) => {
                const dataValue = data[key]
                const dataValueType = getType(dataValue)
                if (dataValueType === 'object') {
                  obj[name] = dataValue[name]
                } else if (dataValueType === 'array') {
                  obj[name] = dataValue[i] === undefined ? null : dataValue[i]
                } else {
                  obj[name] = dataValue === undefined ? null : dataValue
                }
              })
            }
          })
          return obj
        } else if (getType(data) === 'array') {
          return data.map(item => filterNames(item))
        }
        return data
      }
      const value = {}
      Object.keys(this.fields).forEach(name => {
         _set(
          value,
          name,
          _get(this.value, name)
        )
      })
      return filterNames(value)
    },
    setFieldValue(name, value) {
      let fn = (name, value) => {
        const prevValue = _get(this.value, name)
        if (prevValue !== undefined) {
          _set(this.value, name, value)
        } else {
          const formValues = cloneDeep(this.value)
          _set(formValues, name, value)
          this.$emit('input', formValues)
        }
      }
      // 区分 name 特殊格式
      if (name.includes(',')) {
        let names = name.split(',')
        const prevFormValues = cloneDeep(this.value)
        // 值合并
        if (getType(value) === 'array') {
          let isUndefined = false
          names.forEach((nameItem, i) => {
            const prevValue = _get(this.value, nameItem)
            if (prevValue === undefined) {
              isUndefined = true
            } else {
              _set(this.value, nameItem, value[i] === undefined ? null : value[i])
            }
            _set(prevFormValues, nameItem, value[i] === undefined ? null : value[i])
          })
          if (isUndefined) {
            _set(prevFormValues, name, value)
            this.$emit('input', prevFormValues)
          } else {
            _set(this.value, name, value)
          }
        } else if (getType(value) === 'object'){
          let isUndefined = false
          names.forEach((nameItem) => {
            const valueItem = value[nameItem] === undefined ? null : value[nameItem]
            const prevValue = _get(this.value, nameItem)
            if (prevValue === undefined) {
              isUndefined = true
            } else {
              _set(
                this.value,
                nameItem,
                valueItem
              )
            }
            _set(prevFormValues, nameItem, valueItem)
          })
          if (isUndefined) {
            _set(prevFormValues, name, value)
            this.$emit('input', prevFormValues)
          } else {
            _set(this.value, name, value)
          }
        } else if (getType(value) === 'null'){
          let isUndefined = false
          names.forEach((nameItem) => {
            const prevValue = _get(this.value, nameItem)
            if (prevValue === undefined) {
              isUndefined = true
            } else {
              _set(this.value, nameItem, null)
            }
            _set(prevFormValues, nameItem, null)
          })
          if (isUndefined) {
            _set(prevFormValues, name, value)
            this.$emit('input', prevFormValues)
          } else {
            _set(this.value, name, value)
          }
        } else {
          log.error(`不支持的格式${getType(value)}`)
        }
      } else {
        // 原始的 name 也需要更新下
        fn(name, value)
      }
    },
    notifyField(name, trigger = '', runValidate = false) {
      if (this.fields[name] && this.fields[name].length > 0) {
        this.fields[name].forEach(field => {
          field.updateAfter(trigger)
          if (runValidate) {
            field.validate(trigger)
          }
        })
      }
    },
    /**
     * 供外部调用 formValidate
     * names 待校验字段[]，不传则整体校验
     */
    _validateForm(names) {
      let nameCount = 0
      let valid = true
      const fieldsNamesLength = names ? names.length : Object.keys(this.fields).length
      const invalidFields = {}
      
      return new Promise((resolve, reject) => {
        if (fieldsNamesLength === 0) {
          // 空 form 校验直接通过
          return resolve(true)
        }
        (names || Object.keys(this.fields)).forEach((name) => {
          nameCount++
          const fieldsChildrenLen = this.fields[name].length
          let count = 0
          this.fields[name].forEach(field => {
            field.validate('', (errors, invalidField) => {
              if (errors) {
                valid = false
                mergeWith(invalidFields, invalidField)
              }
              // 校验到最后一个字段
              if (nameCount === fieldsNamesLength && ++count === fieldsChildrenLen) {
                if(valid){
                  resolve(true)
                } else {
                  if(this.scrollToFirstError){
                    // 定位到错误元素
                    this.$nextTick(()=>{
                      let firstNode = this.findFirstErrorField()
                      if (firstNode) {
                        if(typeof(firstNode.scrollIntoViewIfNeeded) == "function"){
                          setTimeout(function(){
                            firstNode.scrollIntoViewIfNeeded();
                          }, 100)
                        }else {
                          // 必要时滚动
                          if(!this.isElementInViewport(firstNode)){
                            firstNode.scrollIntoView({
                              block:'center',
                              behavior:'smooth'
                            })
                          }
                        }
                      }
                    })
                  }
                  reject(invalidFields)
                }
              }
            })
          })
        })
      })
    },
    findFirstErrorField(){
      let firstTop
      let firstNode
      const eles = this.$refs.yform.getElementsByClassName('is-error yfield')
      // console.log(eles);
      for (var i = 0; i < eles.length; i++) {
        let node = eles[i]
        if(node){
          var fieldTop = node.getBoundingClientRect().top
          var formTop = this.$refs.yform.getBoundingClientRect().top
          var top = fieldTop - formTop;
          if (firstTop === undefined || firstTop > top) {
            firstTop = top;
            firstNode = node;
          }
        }
      }
      return firstNode
    },
    isElementInViewport (el) {
      // 判断元素是否在视窗内
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
        );
    },
    async validate(names) {
      try {
        const res = await this._validateForm(names)
        this.$listeners.validate && this.$listeners.validate(true)
        return Promise.resolve(res)
      } catch(e) {
        log.error('validate fail', e)
        this.$listeners.validate && this.$listeners.validate(false, e)
        return Promise.reject(e)
      }
    },
    clearValidate(names) {
      const type = getType(names)
      if (!['array', 'string', 'undefined'].includes(type)) {
        return log.error(`clearValidate(params), params不支持的${type}类型`)
      }
      const fieldsNames = names ? type === 'string' ? [names] : names : []
      let fields = {}
      if (fieldsNames.length) {
        fieldsNames.forEach((name) => {
          fields[name] = this.fields[name]
        })
      } else {
        fields = this.fields
      }
      Object.keys(fields).forEach((name) => {
        this.fields[name].forEach(field => {
          field.clearValidate()
        })
      })
    },
    /**
     * 表单重置
     */
    resetFormValues() {
      const value = cloneDeep(this.initialValues)
      this.$emit('input', value)
    },
    async onSubmit() {
      // 校验成功才会执行submit接口
      await this.validate()
      if (this.$listeners.submit) {
        this.submiting = true
        // const formValues = cloneDeep(this.value)
        // 去掉被卸载的字段, 直接返回视图中字段
        const formValues = this._getFormVales()
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
    },
    _queryTableRegister(node) {
      if (!this.$options.childrenQueryTable.includes(node)) {
        this.$options.childrenQueryTable.push(node)
      }
    },
    _queryTableDestory(node) {
      this.$options.childrenQueryTable = this.$options.childrenQueryTable.filter(ele => ele !== node)
    },
  },
  render(h) {
    return h('div', {
      props: {
        ...this.$attrs,
      },
      attrs: filterAttrs(this.$attrs),
      ref: 'yform',
      // 除了 input 事件,其他事件透传
      on: this.events,
    }, [
      this.$slots.default,
      // <pre>value: {JSON.stringify(this.value, null, 2)}</pre>,
    ])
  },
}
</script>
