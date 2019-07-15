import { isOwnProp } from './object'

enum BrowserPrefix {
  webkit = 'webkit',
  moz = 'Moz',
  ms = 'ms',
  o = 'O'
}

const stylePropsFT = (prop: string) => {
  const style: CSSStyleDeclaration = document.createElement('div').style
  return isOwnProp(style, prop)
}

export const setTransform = (el: HTMLElement, value: string) => {
  stylePropsFT(`${BrowserPrefix.webkit}Transform`) &&
    Object.defineProperty(el.style, `${BrowserPrefix.webkit}Transform`, {
      value
    })
  stylePropsFT(`${BrowserPrefix.moz}Transform`) &&
    Object.defineProperty(el.style, `${BrowserPrefix.moz}Transform`, { value })
  stylePropsFT(`${BrowserPrefix.ms}Transform`) &&
    Object.defineProperty(el.style, `${BrowserPrefix.ms}Transform`, { value })
  stylePropsFT(`${BrowserPrefix.o}Transform`) &&
    Object.defineProperty(el.style, `${BrowserPrefix.o}Transform`, { value })
}

export const TRANSLATE_NONE = 'none'
export const translate3d = (y: number) => {
  return `translate3d(0, ${y}px, 0)`
}
