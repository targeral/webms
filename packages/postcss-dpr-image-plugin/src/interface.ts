export interface nextFunction {
  (dpr: string | number, replace: string): void
}

export interface DprObject {
  [index: string]: string
}

export interface DprFunction {
  (next: nextFunction): void
}

export interface DprArray {
  [index: number]: string
}

export type Dpr = DprObject | DprFunction | DprArray

export interface Rule {
  match: string | RegExp
  before: boolean
  after: boolean
  dpr: Dpr
}

export interface IOption {
  rules: Rule[]
}
