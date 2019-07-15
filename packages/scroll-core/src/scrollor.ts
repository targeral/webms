/**
 * 控制滚动条是否可以一直通过滑动的方式滚动，随着滚动的越极限，变化越困难
 */
export type UnlimitedScrollType = 'none' | 'top' | 'bottom' | 'all' | 'damping'
export enum UnlimitedScrollEnum {
  NONE = 'none',
  TOP = 'top',
  BOTTOM = 'bottom',
  ALL = 'all',
  DAMP = 'damping'
}

export type DirectionType = 'horizontal' | 'vertical'
export enum DirectionEnum {
  H = 'horizontal',
  V = 'vertical'
}

export type DampingType = {
  top: number
  bottom: number
}

export interface IScrollorOption {
  direction: DirectionType
  inertia: boolean
  unlimitedScroll: UnlimitedScrollType
  damping: DampingType
}

const DefaultDamping = {
  top: 100,
  bottom: 0
}

export abstract class AbstractScrollor {
  protected conDom: HTMLElement
  protected scrollDom: HTMLElement
  protected direction: DirectionType
  protected inertia: boolean // 惯性
  protected unlimitedScroll: UnlimitedScrollType
  protected damping: DampingType

  constructor(container: HTMLElement, options?: IScrollorOption) {
    const { direction, inertia, damping, unlimitedScroll } = Object.assign(
      {
        direction: DirectionEnum.V,
        inertia: false,
        unlimitedScroll: UnlimitedScrollEnum.NONE,
        damping: DefaultDamping
      },
      options
    )
    this.conDom = container
    this.scrollDom = this.initScroll(container)
    this.direction = direction
    this.inertia = inertia
    this.damping = Object.assign({ top: 0, bottom: 0 }, damping)
    this.unlimitedScroll = unlimitedScroll
  }

  private initScroll(
    container: HTMLElement,
    scroll?: HTMLElement
  ): HTMLElement {
    const { firstElementChild, lastElementChild, children } = container
    if (firstElementChild === lastElementChild && firstElementChild !== null) {
      return <HTMLElement>firstElementChild
    }
    const cloneCon = container.cloneNode(false)
    const divElement = document.createElement('div')
    const fragment = document.createDocumentFragment()
    for (let child of Array.from(children)) {
      divElement.appendChild(child)
    }
    cloneCon.appendChild(divElement)
    fragment.appendChild(cloneCon)
    const parent: HTMLElement = <HTMLElement>container.parentElement
    parent.replaceChild(fragment, container)
    return divElement
  }

  abstract getContainerDom(): HTMLElement
  abstract getScrollDom(): HTMLElement
  abstract getConLength(): number
  abstract getDirection(): DirectionType
  abstract getInertia(): boolean
  abstract getUnlimitedScroll(): UnlimitedScrollType
  abstract getDamping(): DampingType
  abstract getOption(): IScrollorOption
}

export default class Scrollor extends AbstractScrollor {
  getContainerDom(): HTMLElement {
    return this.conDom
  }
  getScrollDom(): HTMLElement {
    return this.scrollDom
  }
  getConLength(): number {
    return this.direction === DirectionEnum.H
      ? this.scrollDom.getBoundingClientRect().width
      : this.scrollDom.getBoundingClientRect().height -
          this.conDom.getBoundingClientRect().height
  }
  getDirection(): DirectionType {
    return this.direction
  }
  getDamping(): DampingType {
    return this.damping
  }
  getInertia(): boolean {
    return this.inertia
  }
  getUnlimitedScroll(): UnlimitedScrollType {
    return this.unlimitedScroll
  }
  getOption(): IScrollorOption {
    const { direction, inertia, damping, unlimitedScroll } = this
    return {
      direction,
      inertia,
      damping,
      unlimitedScroll
    }
  }
}
