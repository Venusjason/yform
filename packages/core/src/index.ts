// import Path from 'cool-path'
import AsyncValidator, { RuleItem } from 'async-validator'
import isEqualWith from 'lodash/isEqualWith'
import cloneDeep from 'lodash/cloneDeep'
import mergeWith from 'lodash/mergeWith'
import _set from 'lodash/set'
import _get from 'lodash/get'

import log from '../../utils/log'
import { getType } from '../../utils/index'
import EventEmiter from './EventEmiter'

// const app = {
//   a: 1,
//   b: 3,
//   c: [
//     {
//       a: 'a'
//     }
//   ],
//   g: {
//     a: 2,
//     b: 3,
//   }
// }

// console.log(
//   'lodash',
//   _get(app, 'g'),
//   _get(app, 'c.0.a'),
//   _set(app, 'e', null),
//   _get(app, 'e[0]')
// )

export type ITrigger = '' | 'blur' | 'change' | 'focus'

export interface FieldRuleItem extends RuleItem {
  trigger?: ITrigger | ITrigger[];
}

export interface IFormFieldItem {
  name: string,
  value: any,
  updating: boolean;
  rules: FieldRuleItem[],
  label: string | any,
  component?: any,
  dirty?: boolean;
  touched?: boolean;
  visited?: boolean;
  error?: string | undefined;
  validateState: '' | 'validating' | 'success' | 'error';
  validateMessage: string;
  /**
   * 主动更新
   */
  onFieldInputChange: (value: any) => void;
  /**
   * 外部更新导致数据更新
   */
  onFieldChange: (value: any) => void;
  /**
   * 校验
   */
  validate: (trigger?: ITrigger, callback?: Function) => void;

  clearValidate: () => void;

  getFilteredRule: (trigger: ITrigger) => RuleItem[];
  /**
   * 生命周期钩子
   */
  beforeFieldDestory: () => void;

  updateByInputChange: (value: any) => void;

  updateByChange: (value: any) => void;

  validateCallback: (data: {
    errorMsg: string,
    state: string,
  }) => void;

}

const eventEmiter = new EventEmiter()

const eventName = (name, formKey): string => `${name}_${formKey}`

const getNameValue = (...args) => {
  if (args.length === 1 && getType(args[0]) === 'object') {
    return args[0]
  } else if (args.length === 2 && getType(args[0]) === 'string') {
    return {
      name: args[0],
      value: args[1],
    }
  } else {
    console.error('参数格式有误')
  }
}

let id = 0

export class Form {
  id = id

  value: {} = {}

  fields: {
    [key: string]: IFormFieldItem[]
  } = {}

  isFieldUpdating: boolean = false

  constructor(value = {}) {
    id++
    this.value = value
    /**
     * 表单域注册
     */
    eventEmiter.on(this.setEventName('FIELD_REGISTER'), this.fieldRegister.bind(this))
    /**
     * 输入更新
     */
    eventEmiter.on(this.setEventName('FIELD_INPUT_CHANGE'), this.fieldInputChange.bind(this))

    eventEmiter.on(this.setEventName('FIELD_INPUT_FOCUS'), this.fieldInputFocus.bind(this))

    eventEmiter.on(this.setEventName('FIELD_INPUT_BLUR'), this.fieldInputBlur.bind(this))
    /**
     * 外部更新导致数据更新
     */
    eventEmiter.on(this.setEventName('FIELD_CHANGE'), this.fieldChange.bind(this))
    /**
     * 销毁
     */
    eventEmiter.on(this.setEventName('FIELD_DESTORY'), this.fieldDestory.bind(this))
  }

  updateFormValues(value) {
    // TODO: 外部赋值进来 才执行,现在回重复执行比对ß
    this.value = value
    /**
     * 外部第一次更新时 不要走校验
     */
    this.notifyAll()
    // if (!isEqualWith(this.value, value)) {
    //   this.value = value
    //   /**
    //    * 外部第一次更新时 不要走校验
    //    */
    //   this.notifyAll()
    // }
  }

  /**
   * 返回表单新值 但是不更新
   * @param name 待更新字段
   * @param value 待更新字段的新值
   */
  getFormNewValues(name, value) {
    const fullValue = _set({}, name, value)
    const formValue = cloneDeep(this.value)
    // console.log(
    //   999,
    //   JSON.stringify(formValue),
    //   JSON.stringify(fullValue)
    // )
    return mergeWith(formValue, fullValue)
  }

  setFieldValue(name: string, value: any, trigger: ITrigger) {
    const prevValue = cloneDeep(_get(this.value, name))
    _set(this.value, name, value)
    this.notifyField(name, value, trigger)
    // 新增的字段 需要通知到vue 去主动更新form.value
    if (prevValue === undefined) {
      this.afterFieldValueUpdate(name, value, cloneDeep(this.value))
    }
  }

  getFieldValue(name: string): any {
    return _get(this.value, name)
  }

  /**
   * 表单校验, 返回一个promise
   * @param names 待校验字段，单个 或 数组, 不传参则全部校验
   */
  validate(names: string | string[] = []): Promise<any> {
    const type = getType(names)
    const fieldsNames = (type === 'string' ? [names] : names) as string[]
    let fields = {}
    if (fieldsNames.length) {
      fieldsNames.forEach((name: string) => {
        fields[name] = this.fields[name]
      })
    } else {
      fields = this.fields
    }
    const fieldsNamesLength = Object.keys(fields).length
    let valid = true
    return new Promise((resolve, reject) => {

      if (fieldsNamesLength === 0) {
        resolve(true)
      } else {
        const invalidFields = {}
        let nameCount = 0
        Object.keys(fields).forEach((name: string) => {
          nameCount++
          const fieldsChildrenLen = this.fields[name].length
          let count = 0
          this.fields[name].forEach(field => {
            field.validate('', (errors, invalidField) => {
              if (errors) {
                valid = false
                /**
                 * TODO: 可以优化进一步合并错误信息
                 */
                mergeWith(invalidFields, invalidField)
              }
              // 校验到最后一个字段
              if (nameCount === fieldsNamesLength && ++count === fieldsChildrenLen) {
                valid ? resolve(true) : reject(invalidFields)
              }
            })
          })
        })
      }
    })

  }

  /**
   * 
   * @param names 移除校验的字段, 不传则移除整个表单校验结果
   */
  clearValidate(names: string | string[] = []) {
    const type = getType(names)
    const fieldsNames = (type === 'string' ? [names] : names) as string[]
    let fields = {}
    if (fieldsNames.length) {
      fieldsNames.forEach((name: string) => {
        fields[name] = this.fields[name]
      })
    } else {
      fields = this.fields
    }
    Object.keys(fields).forEach((name: string) => {
      this.fields[name].forEach(field => {
        field.clearValidate()
      })
    })
  }

  setEventName(name: String) {
    return eventName(name, this.id)
  }

  fieldRegister(field: IFormFieldItem) {
    if (this.fields[field.name]) {
      this.fields[field.name].push(field) 
    } else {
      this.fields[field.name] = [field]
    }
    this.afterFieldRegisterToForm(field)
  }

  afterFieldRegisterToForm(field: IFormFieldItem) {}

  fieldInputChange(data, trigger: ITrigger = 'change') {
    const { name, value } = getNameValue(data)
    this.isFieldUpdating = true
    this.setFieldValue(name, value, trigger)
  }

  fieldInputFocus(field: IFormFieldItem) {
    field.validate('focus')
  }

  fieldInputBlur(field: IFormFieldItem) {
    field.validate('blur')
  }

  fieldChange(data) {
    const { name, value } = getNameValue(data)
    log.help('FIELD_CHANGE', name, value)
  }

  fieldDestory(field) {
    log.help('FIELD_DESTORY', field)
    if (field.name) {
      this.fields[field.name] = this.fields[field.name].filter(f => f !== field)
    }
    if (this.fields[field.name].length === 0) {
      delete this.fields[field.name]
    }
    // TODO: 字段被卸载 要不要去掉values里对应的字段
  }

  notifyField(name: string, value: any, trigger: ITrigger = '') {
    this.fields[name].forEach(field => {
      const isDirty = !isEqualWith(field.value, value)
      if (isDirty) {
        field.value = value
        field.updateByInputChange(value)
        field.validate(trigger)
      }
    })
  }

  notifyAll(trigger: ITrigger = '') {
    Object.keys(this.fields).forEach(fieldName => {
      this.fields[fieldName].forEach(field => {
        const value = _get(this.value, field.name)
        if (!isEqualWith(field.value, value)) {
          const prevValue = cloneDeep(field.value)
          field.value = value
          field.updateByChange(value)
          if (prevValue !== undefined) {
            // 做字段新增操作 不要立即校验
            field.validate(trigger) 
          }
        }
        /**
         * TODO: 比对 再更新
         */
        // const prevValue = cloneDeep(field.value)
        // field.value = value
        // field.updateByChange(value)
        // if (prevValue !== undefined) {
        //   // 做字段新增操作 不要立即校验
        //   field.validate(trigger) 
        // }
      })
    })
  }

    /**
   * 表单卸载前
   */
  beforeDestroy() {
    const names = [
      'FIELD_REGISTER',
      'FIELD_INPUT_CHANGE',
      'FIELD_CHANGE',
      'FIELD_INPUT_FOCUS',
      'FIELD_INPUT_BLUR',
      'FIELD_DESTORY',
    ]
    names.forEach(name => {
      eventEmiter.off(this.setEventName(name))
    })
  }

  /**
   * 表单值更新后
   */
  afterFieldValueUpdate(name, value, formValues) {
  }
}

export const createField = (formId: number) => (
  class Field implements IFormFieldItem {

    name = ''

    value = undefined
    
    rules: FieldRuleItem[] = []

    label = ''

    updating = false

    validateState: '' | 'success' | 'validating' | 'error' = ''

    validateMessage = ''

    constructor(opt: {
      name: string;
      label?: any,
      rules?: FieldRuleItem[]
    }) {
      this.name = opt.name
      this.rules = opt.rules || []
      this.label = opt.label || ''
      eventEmiter.emit(eventName('FIELD_REGISTER', formId), this)
    }

    /**
     * 自身触发数据更新
     * @param value 派发新值
     */
    onFieldInputChange(value: any) {
      eventEmiter.emit(
        eventName('FIELD_INPUT_CHANGE', formId),
        { name: this.name, value }
      )
    }

    onFieldInputBlur(value: any) {
      eventEmiter.emit(
        eventName('FIELD_INPUT_BLUR', formId),
        this
      )
    }

    onFieldInputFocus(value: any) {
      eventEmiter.emit(
        eventName('FIELD_INPUT_FOCUS', formId),
        this
      )
    }

    /**
     * 外部更新导致数据更新
     * @param value 输入新值
     */
    onFieldChange(value: any) {
      eventEmiter.emit(eventName('FIELD_CHANGE', formId), {
        name: this.name,
        value,
      })
    }

    onFieldRulesChange(rules) {
      this.rules = rules
    }

    beforeFieldDestory() {
      eventEmiter.emit(eventName('FIELD_DESTORY', formId), this)
    }

    getFilteredRule(trigger: ITrigger) {
      return this.rules.filter(rule => {
        if (!rule.trigger) {
          return true
        }
        if (getType(rule.trigger) === 'array') {
          return rule.trigger.indexOf(trigger) > -1
        } else {
          return rule.trigger === trigger
        }
      })
    }

    validate(trigger: ITrigger = '', callback) {
      const { value } = this
      const rules = this.getFilteredRule(trigger)
      if (rules.length === 0) {
        callback && callback()
        return true
      }
      const descriptor = {}
      descriptor[this.name] = rules.map(rule => {
        const { trigger: t, ...rest } = rule
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
          this.validateMessage = errors ? errors[0].message : ''
          this.validateState === 'error' && log.warn(`${this.name}: ${this.validateMessage}`)
          callback && callback(this.validateMessage, invalidFields)
          this.validateCallback({
            errorMsg: this.validateMessage,
            state: this.validateState
          })
        }
      )
    }

    clearValidate() {
      this.validateState = ''
      this.validateMessage = ''
      this.clearValidateCallback()
    }

    clearValidateCallback() {}

    updateByInputChange() {}
  
    updateByChange() {}

    validateCallback(data: {
      errorMsg: string,
      state: string,
    }) {}

  }
) 


