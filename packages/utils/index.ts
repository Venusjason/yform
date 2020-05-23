/**
 * 返回数据类型
 * @param data 数据
 * @returns 数据类型 小写
 */
export const getType = (data: any): string => {
  const val = Object.prototype.toString.call(data)
  return val.match(/\[object (.*?)\]/)[1].toLowerCase()
}