export const isOwnProp = (o: Object, prop: string) => {
  return Object.prototype.hasOwnProperty.call(o, prop)
}
