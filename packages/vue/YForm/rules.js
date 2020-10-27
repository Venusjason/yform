import merge from 'lodash/merge'
import log from '../../core/lib/utils/log'
import { getType } from '../../core/lib/utils/index'

const whiteSpaceValodator = (message = '不能为空格字符') => ({
  validator: (rule, val, callback) => {
    if ([null, undefined, ''].includes(val)) {
      return callback()
    }
    if (val.trim() === '') {
      return callback(new Error(message))
    }
    return callback()
  }
})

const requiredArray = (message = '这是必填项') => ({
  validator: (rule, val, callback) => {
    if (Array.isArray(val)) {
      if (val.length === 0) {
        return callback(new Error(message))
      }
      if (val.filter(item => [null, undefined, ''].includes(item)).length > 0) {
        return callback(new Error(message))
      }
    }
    return callback()
  }
})

const validatorFunc = (regRule) => {
  const { reg, message, min, max } = regRule
  if (reg) { // 正则判断
    const validator = (rule, val, callback) => {
      if ([null, undefined, ''].includes(val)) {
        return callback()
      }
      if (!reg.test(val)) {
        return callback(new Error(message))
      }
      callback()
    }
    return { validator }
  } else if (min || max) {  // 长度判断
    const validator = (rule, val, callback) => {
      if ([null, undefined, ''].includes(val)) {
        return callback()
      }
      if (min && val.length < min) {
        return callback(new Error(message))
      }
      if (max && val.length > max) {
        return callback(new Error(message))
      }
      callback()
    }
    return { validator }
  } else {
    return regRule
  }
}


const requiredMsg = (label) => `${label || '这'}是必填项`

const regs = {
  required: {
    required: true,
    message: '这是必填项',
  },
  whiteSpace: whiteSpaceValodator(),
  requiredArray: requiredArray(),
  digital: {
    reg: /^\d+$/,
    message: '请输入数字格式',
  },
  integer1To100: {
    reg: /^(([1-9]\d?)|100)$/,
    message: '请输入非零正整数且不大于100',
  },
  positiveInteger: {
    reg: /^[0-9]*$/,
    message: '请输入非负整数',
  },
  integer: {
    reg: /^-?[0-9]*$/,
    message: '请输入整数',
  },
  maxFixed2: {
    reg:  /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
    message: '请输入数字，最多保留2位小数',
  },
  money: {
    reg:  /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
    message: '请输入数字，最多保留2位小数',
  },
  limit0to100MaxFixed2: {
    reg: /^([0-9]\d?(\.\d{1,2})?|0.\d{1,2}|100|100.0|100.00)$/,
    message: '100之间数字，最多保留2位小数'
  },
  email: {
    reg: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
    message: '邮箱格式有误',
  },
  phone: {
    reg: /^1[0-9]{10}$/,
    message: '手机号格式有误',
  },
  url: {
    reg: /^(ht|f)tps?:\/\//i,
    message: '网址格式有误',
  },
  chinese: {
    reg: /[\u4e00-\u9fa5]/gm,
    message: '请输入中文',
  },
  englishAndDigital: {
    reg: /^[a-z0-9]+$/i,
    message: '请输入字母和数字',
  }
}

export const extendRules = (newRegs) => {
  // log.help(`请在入口main.js 注入quickRules 的扩展`)
  merge(regs, newRegs)
}

const rulelistLog = () => {
  log.warn('当前快捷校验已支持以下')
  const arr = Object.keys(regs).map(key => {
    return {
      ruleName: key,
      errorMsg: (getType(regs[key]) === 'object' && regs[key].message) || '-'
    }
  })
  log.table(arr)
}

export const computedRules = (rules, label) => {
  const rulesResult = []
  const type = getType(rules)
  if (type === 'array') {
    rules.forEach(element => {
      rulesResult.push(...computedRules(element, label))
    })
  } else if (type === 'string') {
    if (rules && regs[rules] !== undefined) {
      const ruleItem = rules === 'required' ? {
        ...regs['required'],
        message: requiredMsg(label),
      } : validatorFunc(regs[rules])
      rulesResult.push(ruleItem)
    } else if (rules !== ''){
      log.error(`${rules} 不在快捷校验方式中，你可自行扩展`)
      rulelistLog()
    }
  } else if (type === 'object') {
    const {
      message,
      validator,
      whiteSpace,
      required,
      trigger = '',
      ...rest
    } = rules
    if (validator) {
      rulesResult.push(rules)
    }
    if (required) {
      rulesResult.push({
        ...regs.required,
        ...rest,
        message: message || requiredMsg(label),
        trigger,
      })
    }
    if (whiteSpace) {
      rulesResult.push({
        ...rest,
        ...regs.whiteSpace(message),
        trigger,
      })
    }
    Object.keys(rest).forEach(ruleName => {
      if ((rest[ruleName] === true && regs[ruleName]) || ['type', 'min', 'max'].includes(ruleName)) {
        let ruleReg
        if(regs[ruleName]){
          ruleReg = {
            ...regs[ruleName],
          }
        }else{
          ruleReg = rest
        }
        if (message) {
          ruleReg.message = message
        }
        
        rulesResult.push({
          ...validatorFunc(ruleReg),
          trigger,
        })
      }

      if (!regs[ruleName] && !['type', 'min', 'max'].includes(ruleName)) {
        log.error(`${ruleName} 不在快捷校验方式中，你可自行扩展`)
        rulelistLog()
      }
    })
  }
  return rulesResult
}
