/**
 * 返回数据类型
 * @param data 数据
 * @returns 数据类型 小写
 */
export const getType = (data: any): string => {
  const val = Object.prototype.toString.call(data)
  return val.match(/\[object (.*?)\]/)[1].toLowerCase()
}

/**
 * @param {*} str 驼峰命名 => 连接符格式字符串
 * 返回 连接符格式字符串
 */
export const dasherize = (str: string): string => str.replace(/::/g, '/')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z\d])([A-Z])/g, '$1_$2')
    .replace(/_/g, '-')
    .toLowerCase()

/**
 * 
 * @param name 连接符 转 驼峰
 */
export const toHump = (name: string): string => name.replace(/\-(\w)/g, function(all, letter) {
  return letter.toUpperCase()
})

/**
 * 获取 on开头的事件属性
 * @param obj 
 */
export const getEvents = (obj: {}) => {
  const events = {}
  const rest = {}
  Object.keys(obj).forEach(key => {
    if (key.indexOf('on') === 0) {
      const str = key.slice(2)
      // 首字母转化小写
      const eventKey = str.replace(str[0], str[0].toLowerCase())
      events[eventKey] = obj[key]
    } else {
      rest[key] = obj[key]
    }
  })
  return {
    on: events,
    ...rest,
  }
}

/**
 * 是不是开发环境
 */

export const isDevelopment = process && process.env && process.env.NODE_ENV === 'development'

/**
 * 返回原生attrs
 * @param data attrs
 */
export const filterAttrs = (data: Object): Object => {
  const attrs = {}
  Object.keys(data).forEach(key => {
    if (['string', 'number', 'boolean'].includes(getType(data[key]))) {
      attrs[key] = data[key]
    }
  })
  return attrs
}