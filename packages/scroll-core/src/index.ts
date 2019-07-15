import Scrollor, { AbstractScrollor, IScrollorOption } from './scrollor'
import ScrollCore, { IScrollCore } from './scrollCore'
import ScrollBehavior, {
  IScrollorBehavior,
  IScrollBehaviorCallBack
} from './scrollBehavior'
import ScrollRender, { IScrollRender } from './scrollRender'
import { getElement } from 'share-utils/src/dom'

export default class Scroll {
  private scrollBehavior: IScrollorBehavior
  private scrollRender: IScrollRender

  constructor(_el: HTMLElement | string, option?: IScrollorOption) {
    const scrollor: AbstractScrollor = new Scrollor(getElement(_el), option)
    const scrollCore: IScrollCore = new ScrollCore(scrollor)
    this.scrollBehavior = new ScrollBehavior(scrollCore, scrollor)
    this.scrollRender = new ScrollRender(scrollCore, scrollor)
  }

  onReachStart(fn: IScrollBehaviorCallBack) {
    this.scrollBehavior.onReachStart(fn)
  }

  onReachEnd(fn: IScrollBehaviorCallBack) {
    this.scrollBehavior.onReachEnd(fn)
  }

  onLoading(fn: IScrollBehaviorCallBack) {
    this.scrollBehavior.onLoading(fn)
  }

  onPullRefresh(fn: IScrollBehaviorCallBack) {
    this.scrollBehavior.onPullRefresh(fn)
  }

  onOverScroll(fn: IScrollBehaviorCallBack) {
    this.scrollBehavior.onOverScroll(fn)
  }
}
