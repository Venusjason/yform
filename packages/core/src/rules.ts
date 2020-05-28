import { FieldRuleItem } from './index'
import { getType } from '../../utils/index'
import log from '../../utils/log'
/**
 * {
 *  required: true,
 * min: 2,
 * max: 9,
 * whiteSpace: true,
 * money: true,
 * email: true,
 * url: true,
 * phone: true,
 * integer1To100: true,
 * 
 * }
 */
/**
 * 校验 高阶函数
 * @param {*} regRule [reg, message]
 */
export const validatorFunc = (regRule) => {

  const type = getType(regRule)

  if (type === 'array') {
    const [reg, message] = regRule
    const validator = (rule, val, callback) => {
      // 有输入值 并且输入值不合法
      if ([null, undefined, ''].includes(val)) {
        return callback()
      }
      if (!reg.test(val)) {
        return callback(new Error(message))
      }
      callback()
    }
    return { validator }
  } else if (type === 'object') {
    return regRule
  }
}

export const regs = {
  required: {
    required: true, message: '这是必填项',
  },
  whiteSpace: {
    validator: (rule, val, callback) => {
      if ([null, undefined, ''].includes(val)) {
        return callback()
      }
      if (val.trim() === '') {
        return callback(new Error('不能为空格字符'))
      }
      return callback()
    }
  },
  digital: [
    /^\d+$/,
    '请输入数字格式'
  ],
  // 1 ~ 100之间的整数
  integer1To100: [/^(([1-9]\d?)|100)$/, '请输入非零正整数且不大于100'],
  // 非负整数
  positiveInteger: [/^[0-9]*$/, '请输入整数'],
  // 整数 包含: 正 负 0
  integer: [/^-?[0-9]*$/, '请输入非负整数'],
  // 最多保留2位小数
  maxFixed2: [
    /^-?[0-9]+(.[0-9]{1,2})?$/,
    '请输入数字，最多保留2位小数',
  ],
  money: [
    /^-?[0-9]+(.[0-9]{1,2})?$/,
    '请输入数字，最多保留2位小数',
  ],
  // 0 ~ 100 最多2位小数 包含0
  limit0to100MaxFixed2: [
    /^([0-9]\d?(\.\d{1,2})?|0.\d{1,2}|100|100.0|100.00)$/,
    '100之间数字，最多保留2位小数'
  ],
  email: [
    /^([0-9]\d?(\.\d{1,2})?|0.\d{1,2}|100|100.0|100.00)$/,
    '邮箱格式有误',
  ],
  phone: [
    /^1[0-9]{10}$/,
    '手机号格式有误'
  ],
  url: [
    /^(ht|f)tps?:\/\//i,
    '网址格式有误'
  ],
  chinese: [
    /[\u4e00-\u9fa5]/gm,
    '请输入中文'
  ],
  englishAndDigital: [
    /^[a-z0-9]+$/i,
    '请输入字母和数字'
  ],
}

export const extendRules = (newRegs) => {
  log.help(`请在入口main.js 注入quickRules 的扩展`)
  Object.assign(regs, newRegs)
}

export const rulelistLog = () => {
  if (process.env.NODE_ENV !== 'development') return
  log.warn('当前快捷校验已支持以下')
  const arr = Object.keys(regs).map(key => {
    return {
      ruleName: key,
      errorMsg: (getType(regs[key]) === 'array' && regs[key][1]) || '-'
    }
  })
  log.table(arr)
}

/**
 * 返回标准格式的 validator
 * @param rules 
 */
export const computedRules = (rules: any): FieldRuleItem[] => {
  const rulesResult: FieldRuleItem[] = []
  if (getType(rules) === 'string') {
    if (regs[rules] !== undefined) {
      rulesResult.push(validatorFunc(regs[rules]))
    } else {
      log.error(`${rules} 不在快捷校验方式中，你可自行扩展`)
      rulelistLog()
    }
  } else if (getType(rules) === 'array') {
    rules.map((rule: any) => {
      if (getType(rule) === 'string') {
        rulesResult.push(...computedRules(rule))
      } else if (getType(rule) === 'object') {
        rulesResult.push(...computedRules(rule))
      }
    })
  } else if (getType(rules) === 'object') {
    if (!rules.validator) {
      // 快捷校验
      Object.keys(rules).forEach((ruleKey: string) => {
        if (regs[ruleKey] !== undefined && regs[ruleKey]) {
          if (['min', 'max'].includes(ruleKey)) {
            rulesResult.push(
              {
                [ruleKey]: rules[ruleKey], message: `最${ruleKey === 'min' ? '少' : '多'}${rules[ruleKey]}个字符`
              },
            )
          } else {
            rulesResult.push(validatorFunc(regs[ruleKey]))
          }
        } else {
          log.error(`${ruleKey} 不在快捷校验方式中，你可自行扩展`)
          rulelistLog()
        }
      })
    } else {
      // 自定义校验
      rulesResult.push(rules)
    }
  }
  return rulesResult
}