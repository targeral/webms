export const isBoolean = (value: any) => typeof value === 'boolean'
export const isString = (value: any) => typeof value === 'string'
export const isNull = (value: any) => value === null
export const isObject = (value: any) =>
  Object.prototype.toString.call(value) === '[object Object]'
