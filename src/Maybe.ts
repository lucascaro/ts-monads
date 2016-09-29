import {Monad} from './Monad'

export interface MaybeCase<T,U,V> {
  some(t: T): U
  none(t: T): V
}

export interface Maybe<T> extends Monad<T> {
  isSome: boolean
  isNone: boolean
  bind<T>(transform: (T) => Maybe<T>): Maybe<T>
  unit<T>(value: T): Maybe<T>
  map<U>(transform: (T) => U): Maybe<U>
  ap<U>(m: Maybe<((t: T) => U)>): Maybe<U>
  join<U extends Maybe<T>>(): Maybe<T>
  takeLeft<U>(m: Maybe<U>): Maybe<T|U>
  takeRight<U>(m: Maybe<U>): Maybe<U>
  caseOf<U,V>(c: MaybeCase<T,U,V>): U|V
}

export interface Some<T> extends Maybe<T> {}
export function some<T>(t: T): Some<T> {
  const value: T = t
  const isSome: boolean = true
  const isNone: boolean = false
  const self = {
    value,
    isSome,
    isNone,
    bind,
    map,
    unit,
    ap,
    join,
    takeLeft,
    takeRight,
    caseOf,
    toString
  }

  function bind<U>(transform: (t: T) => Maybe<U>): Maybe<U> {
    return transform(value)
  }

  function map<U>(transform: (t: T) => U): Some<U> {
    return some<U>(transform(value))
  }

  function unit<T>(v: T): Some<T> {
    return some<T>(v)
  }

  function ap<U>(m: Maybe<((t: T) => U)>): Maybe<U> {
    return m.unit(m.value(value))
  }

  function join<U extends Maybe<T>>(): Maybe<T> {
    return none(value) // wat
  }

  function takeLeft<U>(m: Maybe<U>): Maybe<T|U> {
    return m.isSome ? self : none(m.value)
  }

  function takeRight<U>(m: Maybe<U>): Maybe<U> {
    return m.isSome ? m : none(m.value)
  }

  function toString(): string {
    return `Some(${value})`
  }

  function caseOf<U,V>(c: MaybeCase<T,U,V>): U {
    return c.some(value)
  }

  return Object.freeze(self)
}

export interface None<T> extends Maybe<T> {}
export function none<T>(t: T): Maybe<T> {
  const value: T = t
  const isSome: boolean = false
  const isNone: boolean = true
  const self = {
    value,
    isSome,
    isNone,
    bind,
    map,
    unit,
    ap,
    join,
    takeLeft,
    takeRight,
    caseOf,
    toString
  }

  function bind(transform: (t: T) => Maybe<T>): Maybe<T> {
    return self
  }

  function map<U>(transform: (t: T) => U): None<U> {
    return none<U>(transform(value))
  }

  function unit(v: T): None<T> {
    return none<T>(v)
  }

  function ap<U>(m: Monad<((T) => U)>): None<U> {
    return none<U>(m.value(value))
  }

  function join<U extends Maybe<T>>(): Maybe<T> {
    return none(value) // wat
  }

  function takeLeft<U>(m: Monad<U>): Maybe<T> {
    return self
  }

  function takeRight<U>(m: Monad<U>): Maybe<T> {
    return none(value)
  }

  function toString(): string {
    return `None(${value})`
  }

  function caseOf<U,V>(c: MaybeCase<T,U,V>): V {
    return c.none(value)
  }
  return Object.freeze(self)

}
