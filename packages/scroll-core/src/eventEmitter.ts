interface IEventsMap {
  [name: string]: [Function, Object][]
}

interface ITypesMap {
  [type: string]: string
}

interface IMagicFn extends Function {
  fn?: Function
}

export default class EventEmitter {
  events: IEventsMap
  eventTypes: ITypesMap
  constructor(names: string[]) {
    this.events = {}
    this.eventTypes = {}
    this.registerType(names)
  }

  /**
   * registerType
   */
  protected registerType(names: string[]) {
    names.forEach(name => (this.eventTypes[name] = name))
  }

  /**
   * on
   */
  protected on(type: string, fn: Function, context: any = this) {
    this._checkInTypes(type)
    if (!this.events[type]) {
      this.events[type] = []
    }

    this.events[type].push([fn, context])
    return this
  }

  /**
   * once
   */
  protected once(type: string, fn: Function, context: any = this) {
    this._checkInTypes(type)
    const magic: IMagicFn = (...args: any[]) => {
      this.off(type, magic)

      fn.apply(context, args)
    }
    magic.fn = magic

    this.on(type, magic)
    return this
  }

  /**
   * off
   */
  protected off(type?: string, fn?: Function) {
    if (!type && !fn) {
      this.events = {}
      return this
    }

    if (type) {
      this._checkInTypes(type)
      if (!fn) {
        this.events[type] = []
        return this
      }

      let events = this.events[type]
      if (!events) {
        return this
      }

      let counts = events.length
      while (counts--) {
        if (
          events[counts][0] === fn ||
          (events[counts][0] && (events[counts][0] as IMagicFn).fn === fn)
        ) {
          events.splice(counts, 1)
        }
      }

      return this
    }

    return this
  }

  /**
   * trigger
   */
  protected trigger(type: string, ...args: any[]) {
    this._checkInTypes(type)
    let events = this.events[type]
    if (!events) {
      return
    }

    let len = events.length
    let eventsCopy = [...events]
    let ret
    for (let i = 0; i < len; i++) {
      let event = events[i]
      let [fn, context] = event
      if (fn) {
        ret = fn.apply(context, args)
        if (ret === true) break
      }
    }
    return ret
  }

  /**
   * destory
   */
  protected destory() {
    this.eventTypes = {}
    this.events = {}
  }

  private _checkInTypes(type: string) {
    const types = this.eventTypes
    const inTypes = types[type] === type
    if (!inTypes) {
      console.error(
        `EventEmitter has used unknown event type: "${type}", should be oneof [${Object.keys(
          types
        )}]`
      )
    }
  }
}
