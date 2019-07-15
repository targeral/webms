import EventEmitter from './eventEmitter'
import { IScrollCore } from './scrollCore'
import { AbstractScrollor } from './scrollor'

export interface IScrollBehaviorCallBack {
  (data: any, context: any): void
}

export interface IScrollorBehavior {
  onReachStart: (cb: IScrollBehaviorCallBack) => void
  onReachEnd: (cb: IScrollBehaviorCallBack) => void
  onPullRefresh: (cb: IScrollBehaviorCallBack) => void
  onLoading: (cb: IScrollBehaviorCallBack) => void
  onOverScroll: (cb: IScrollBehaviorCallBack) => void
}

const scrollEvents: string[] = [
  'reachstart',
  'reachend',
  'pullrefresh',
  'loading',
  'overscroll',
  'scroll'
]
const scrollEventsMap: Map<string, string> = new Map(
  scrollEvents.map(v => [v, v])
)

export default class ScrollorBehavior extends EventEmitter
  implements IScrollorBehavior {
  protected scrollUpperLimit: boolean
  protected scrollLowerLimit: boolean
  protected containerStart: number
  protected containerEnd: number
  protected scroll: number
  private scrollCore: IScrollCore
  private scrollor: AbstractScrollor

  constructor(scrollCore: IScrollCore, scrollor: AbstractScrollor) {
    super(scrollEvents)
    this.scrollor = scrollor
    this.scrollCore = scrollCore
    this.containerStart = 0
    this.containerEnd = this.scrollor.getConLength()

    this.scrollCore.scroll(({ scrollTop }) => {
      this.checkScrollState(scrollTop)
    })
  }

  protected checkScrollState(currentScroll: number): void {
    if (-currentScroll === this.containerStart) {
      this.trigger('reachstart')
    } else if (-currentScroll === this.containerEnd) {
      this.trigger('reachend')
    } else if (
      -currentScroll > this.containerEnd ||
      -currentScroll < this.containerStart
    ) {
      const isOverStart = -currentScroll > this.containerEnd
      this.trigger('overscroll', isOverStart)
    } else {
      this.trigger('scroll')
    }
  }

  onReachStart(fn: IScrollBehaviorCallBack) {
    this.on(scrollEventsMap.get('reachstart') as string, () =>
      fn(this.scroll, this)
    )
  }

  onReachEnd(fn: IScrollBehaviorCallBack) {
    this.on(scrollEventsMap.get('reachend') as string, () =>
      fn(this.scroll, this)
    )
  }

  onOverScroll(fn: IScrollBehaviorCallBack) {
    this.on(scrollEventsMap.get('overscroll') as string, () =>
      fn(this.scroll, this)
    )
  }

  onLoading(fn: IScrollBehaviorCallBack) {
    this.on(
      scrollEventsMap.get('overscroll') as string,
      (isOverStart: boolean) => {
        !isOverStart && fn(this.scroll, this)
      }
    )
  }

  onPullRefresh(fn: IScrollBehaviorCallBack) {
    this.on(
      scrollEventsMap.get('overscroll') as string,
      (isOverStart: boolean) => {
        isOverStart && fn(this.scroll, this)
      }
    )
  }
}
