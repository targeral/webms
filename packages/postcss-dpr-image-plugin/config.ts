/**
 * background: url('http://www.baidu.com/a.png');
 * http://www.baidu.com/a@2x.png
 */

interface nextFunction {
  (dpr: string | number, replace: string): void
}

interface DprObject {
  [index: string]: string
}

interface DprFunction {
  (next: nextFunction): void
}

interface DprArray {
  [index: number]: string
}

type Dpr = DprObject | DprFunction | DprArray

interface Rule {
  match: string | RegExp
  before: boolean
  after: boolean
  dpr: Dpr
}

interface IConfig {
  rules: Rule[]
}

const config: IConfig = {
  rules: [
    {
      match: '.png',
      before: true,
      after: false,
      dpr: {
        '1': '@1x',
        '2': '@2x',
        '3': '@3x'
      }
    },
    {
      match: '.png',
      before: true,
      after: false,
      dpr: (next: nextFunction) => {
        for (let i = 0; i < 3; i++) {
          next(i, `@${i}x`)
        }
      }
    }
  ]
}

const aboutImageCssProperty = [
  'background',
  'background-image',
  'border-image',
  'border-image-outset',
  'border-image-repeat',
  'border-image-slice',
  'border-image-source',
  'border-image-width',
  'image()',
  'image-orientation',
  'image-rendering',
  'image-set()',
  'shape-image-threshold',
  'list-style-image',
  'mask-image'
]
