import {
  AbstractScrollor,
  IScrollorOption,
  DirectionEnum,
  UnlimitedScrollEnum,
  UnlimitedScrollType,
  DampingType
} from './scrollor'
import { addEvent, TouchEventEnum } from 'share-utils/src/dom'
import EventEmitter from './eventEmitter'

export interface IScrollCBOption {
  $el: HTMLElement
  $con: HTMLElement
  option: IScrollorOption
  scrollTop: number
}

export type scrollCB = (option: IScrollCBOption) => void

export interface IScrollCore {
  willScroll: (fn: scrollCB) => void
  scroll: (fn: scrollCB) => void
  DidScroll: (fn: scrollCB) => void
}

const scrollEvents: string[] = ['willscroll', 'scroll', 'didscroll']

export default class ScrollCore extends EventEmitter implements IScrollCore {
  private starTouchtValue: number
  private prevTouchValue: number = 0
  private scrollTop: number
  private scrollor: AbstractScrollor

  constructor(scrollor: AbstractScrollor) {
    super(scrollEvents)
    this.scrollor = scrollor
    this.bindEvents(scrollor.getScrollDom())
  }

  private getTouchValue(event: TouchEvent): number {
    const touches: TouchList = event.touches
    const touch: Touch = touches[0]
    const direction = this.scrollor.getDirection()
    const { clientX: X, clientY: Y } = touch
    return direction === DirectionEnum.H ? X : Y
  }

  private _onTouchStart(event: TouchEvent) {
    this.starTouchtValue = this.getTouchValue(event)
    console.log(this.starTouchtValue)
    this.checkScrollState(this.scrollTop, 'willscroll')
  }

  private getScrollTop(scrollTop: number): number {
    const conLength: number = this.scrollor.getConLength()
    const unlimitscrollType: UnlimitedScrollType = this.scrollor.getUnlimitedScroll()

    if (unlimitscrollType === UnlimitedScrollEnum.NONE) {
      if (-scrollTop > conLength) {
        return -conLength
      } else if (-scrollTop < 0) {
        return 0
      } else {
        return scrollTop
      }
    } else if (unlimitscrollType === UnlimitedScrollEnum.BOTTOM) {
      return scrollTop
    } else if (unlimitscrollType === UnlimitedScrollEnum.TOP) {
      return scrollTop
    } else if (unlimitscrollType === UnlimitedScrollEnum.ALL) {
      return scrollTop
    } else {
      const damping: DampingType = this.scrollor.getDamping()
      if (-scrollTop > conLength + damping.bottom) {
        return -(conLength + damping.bottom)
      } else if (-scrollTop < -damping.top) {
        return damping.top
      } else {
        return scrollTop
      }
    }
  }

  private _onTouchMove(event: TouchEvent) {
    const currentTouchValue = this.getTouchValue(event)
    const updateTouchValue = currentTouchValue - this.starTouchtValue
    const willScrollTop = this.prevTouchValue + updateTouchValue

    this.scrollTop = this.getScrollTop(willScrollTop)
    this.checkScrollState(this.scrollTop, 'scroll')
  }

  private _onTouchEnd() {
    this.prevTouchValue = this.scrollTop
  }

  private _getBaseData() {
    return {
      $el: this.scrollor.getScrollDom(),
      $con: this.scrollor.getContainerDom(),
      option: this.scrollor.getOption()
    }
  }

  protected checkScrollState(scrollTop: number, scrollEvent: string) {
    const option: IScrollCBOption = {
      scrollTop,
      ...this._getBaseData()
    }
    this.trigger(scrollEvent, option)
  }

  bindEvents(dom: HTMLElement): void {
    addEvent(dom, TouchEventEnum.touchStar, this._onTouchStart.bind(this))
    addEvent(dom, TouchEventEnum.touchMove, this._onTouchMove.bind(this))
    addEvent(dom, TouchEventEnum.touchEnd, this._onTouchEnd.bind(this))
  }

  willScroll(fn: scrollCB) {
    this.on('willscroll', (option: IScrollCBOption) => fn(option))
  }

  scroll(fn: scrollCB): void {
    this.on('scroll', (option: IScrollCBOption) => fn(option))
  }

  DidScroll(fn: scrollCB): void {
    this.on('didscroll', (option: IScrollCBOption) => fn(option))
  }
}
