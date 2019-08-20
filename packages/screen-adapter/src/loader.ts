import loaderUtils from 'loader-utils'
import { IOption } from './interface'
import { defaultRootFontSize, defaultRatio } from './config'

const pxToRem = (
  str: string,
  fontSize: number = defaultRootFontSize
): string => {
  const reg = /(\d)+(px)/gi
  const newStr: string = str.replace(reg, (substring: string): string => {
    const px: string = substring.replace(/px/i, '')
    return `${Number(px) / fontSize}rem`
  })
  return newStr
}

export default function(content: string) {
  const options: IOption = <IOption>loaderUtils.getOptions(this)
  const { ratio = defaultRatio, rootFontSize = defaultRootFontSize } = options
  const returnContent: string = pxToRem(content, rootFontSize * ratio)
  return returnContent
}

export const loader = require.resolve('./loader')
