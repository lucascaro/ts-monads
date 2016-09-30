import {Monad} from './Monad'

export interface MaybeCase<T,U,V> {
  some(t: T): U
  none(t: T): V
}

export interface Maybe<T> extends Monad<T> {
  isSome: boolean
  isNone: boolean
  value: T
  bind<U>(transform: (t: T) => Maybe<U>): Maybe<U>
  unit<T>(value: T): Maybe<T>
  map<U>(transform: (t: T) => U): Maybe<U>
  ap<U>(m: Maybe<(t: T) => U>): Maybe<U>
  join(): T
  takeLeft<U>(m: Maybe<U>): Maybe<T|U>
  takeRight<U>(m: Maybe<U>): Maybe<U>
  filter(f: (t: T) => boolean): Maybe<T>
  defaulting(t: T): Some<T>
  caseOf<U,V>(c: MaybeCase<T,U,V>): U | V
  orSome<U>(m: U): T | U
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
    filter,
    toString,
    defaulting,
    caseOf,
    orSome
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

  function ap<U>(m: Maybe<(t: T) => U>): Maybe<U> {
    const r = m.value(self.value)
    return m.isSome ? some(r) : none(r)
  }
  // join m = m >>= id
  function join(): T {
    return value
  }

  function takeLeft<U>(m: Maybe<U>): Maybe<T|U> {
    return m.isSome ? self : none(m.value)
  }

  function takeRight<U>(m: Maybe<U>): Maybe<U> {
    return m.isSome ? m : none(m.value)
  }

  function filter(f: (t: T) => boolean): Maybe<T> {
    return f(self.value) ? self : none<T>()
  }

  function toString(): string {
    return `Some(${value})`
  }

  function caseOf<U,V>(c: MaybeCase<T,U,V>): U {
    return c.some(value)
  }

  function orSome<U>(v: U): T {
    return self.value
  }

  function defaulting(t: T): Some<T> {
    return self
  }

  return Object.freeze(self)
}

export interface None<T> extends Maybe<T> {}
export function none<T>(t?: T): Maybe<T> {
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
    filter,
    toString,
    caseOf,
    defaulting,
    orSome
  }

  function bind<U>(transform: (t: T) => Maybe<U>): Maybe<T> {
    return self
  }

  function map<U>(transform: (t: T) => U): None<T> {
    return self
  }

  function unit(v: T): None<T> {
    return none(v)
  }

  function ap<U>(m: Maybe<(t: T) => U>): Maybe<U> {
    return none<U>()
  }

  function join(): T {
    return self.value
  }

  function takeLeft<U>(m: Maybe<U>): Maybe<T> {
    return self
  }

  function takeRight<U>(m: Maybe<U>): Maybe<T> {
    return none(value)
  }

  function filter(f: (t: T) => boolean): Maybe<T> {
    return self
  }

  function toString(): string {
    return `None(${value})`
  }

  function caseOf<U,V>(c: MaybeCase<T,U,V>): V {
    return c.none(value)
  }

  function defaulting(t: T): Some<T> {
    return some(t)
  }

  function orSome<U>(v: U): U {
    return v
  }

  return Object.freeze(self)

}
