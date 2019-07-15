import { isObject, isString, isNull } from './checkType'
import { warn } from './warn'

export enum TouchEventEnum {
  touchStar = 'touchstart',
  touchMove = 'touchmove',
  touchEnd = 'touchend'
}

export const getElement = (el: HTMLElement | string): HTMLElement => {
  let ret = isString(el)
    ? (document.querySelector(el as string) as HTMLElement)
    : (el as HTMLElement)

  isNull(ret) && warn('no querySelector element')

  return ret
}

export const addEvent = (
  el: HTMLElement,
  eventName: TouchEventEnum,
  fn: (e: TouchEvent) => void,
  capture?: AddEventListenerOptions
) => {
  el.addEventListener(
    eventName,
    fn,
    isObject(capture) ? capture : { passive: false, capture: !!capture }
  )
}
