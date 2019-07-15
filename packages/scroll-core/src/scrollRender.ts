import { setTransform } from 'share-utils/src/style'
import { AbstractScrollor } from './scrollor'
import { IScrollCore } from './scrollCore'

export interface IScrollRender {
  initStyle: () => void
  updateScrollStyle: (scroll: number) => void
  inertiaEffect: () => void
}

export default class ScrollRender implements IScrollRender {
  private $el: HTMLElement
  private scrollCore: IScrollCore
  private scrollor: AbstractScrollor

  constructor(scrollCore: IScrollCore, scrollor: AbstractScrollor) {
    this.scrollor = scrollor
    this.scrollCore = scrollCore
    this.$el = scrollor.getScrollDom()

    this.scrollCore.willScroll(() => {
      // this.initStyle();
    })

    this.scrollCore.scroll(({ scrollTop }) => {
      this.updateScrollStyle(scrollTop)
    })
  }

  /**
   * 惯性效果
   */
  inertiaEffect() {
    console.log('执行惯性效果')
  }

  initStyle() {
    setTransform(this.$el, 'none')
  }

  updateScrollStyle(scroll: number) {
    setTransform(this.$el, `translate3d(0, ${scroll}px, 0)`)
  }
}
