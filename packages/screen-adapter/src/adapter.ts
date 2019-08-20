import { IOption } from './interface'
import { defaultRootFontSize, defaultWidth, defaultRatio } from './config'

class ScreenAdapter {
  private options: IOption
  private fn: () => any

  constructor(options: IOption) {
    this.options = Object.assign(
      {
        ratio: defaultRatio,
        designWidth: defaultWidth
      },
      options
    )
    this.fn = this.adapter.bind(this)
    window.addEventListener('DOMContentLoaded', this.fn)
    this.open()
  }

  private adapter(): void {
    const designWidth = this.options.designWidth
    const cssDesignWidth = designWidth / this.options.ratio
    const scale = document.documentElement.clientWidth / cssDesignWidth
    const rootFontSize = defaultRootFontSize * scale
    document.documentElement.style.fontSize = `${rootFontSize}px`
  }

  open(): void {
    window.addEventListener('resize', this.fn)
  }

  close(): void {
    window.removeEventListener('resize', this.fn)
  }
}

export default ScreenAdapter
