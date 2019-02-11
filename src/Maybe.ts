import { Monad } from './Monad'

export interface MaybeCase<T, U, V> {
  some (t: T): U
  none (): V
}

export interface OptionalMaybeCase<T, U> {
  some? (t: T): U
  none? (): U
}

export interface Maybe<T> extends Monad<T> {
  isSome: boolean
  isNone: boolean
  value: T
  bind<U> (transform: (t: T) => Maybe<U>): Maybe<U>
  unit (value: T): Maybe<T>
  map<U> (transform: (t: T) => U): Maybe<U>
  ap<U> (m: Maybe<(t: T) => U>): Maybe<U>
  takeLeft<U> (m: Maybe<U>): Maybe<T | U>
  takeRight<U> (m: Maybe<U>): Maybe<U>
  join (): T
  filter (f: (t: T) => boolean): Maybe<T>
  defaulting (t: T): Some<T>
  caseOf<U, V> (c: MaybeCase<T, U, V>): U | V
  orSome<U> (m: U): T | U
  orElse (m: Maybe<T>): Maybe<T>
  do<U> (p: OptionalMaybeCase<T, U>): Maybe<T>
}

export interface Some<T> extends Maybe<T> {}
export function some<T> (t: T): Some<T> {
  const value: T = t
  const isSome: boolean = true
  const isNone: boolean = false
  const self: Maybe<T> = {
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
    orSome,
    orElse,
    do: doIt
  }

  function bind<U> (transform: (t: T) => Maybe<U>): Maybe<U> {
    return transform(value)
  }

  function map<U> (transform: (t: T) => U): Some<U> {
    return some<U>(transform(value))
  }

  function unit (v: T): Some<T> {
    return some<T>(v)
  }

  function ap<U> (m: Maybe<(t: T) => U>): Maybe<U> {
    const r = m.value(self.value)
    return m.isSome ? some(r) : none(r)
  }
  // join m = m >>= id
  function join (): T {
    return value
  }

  function takeLeft<U> (m: Maybe<U>): Maybe<T | U> {
    return m.isSome ? self : none(m.value)
  }

  function takeRight<U> (m: Maybe<U>): Maybe<U> {
    return m
  }

  function filter (f: (t: T) => boolean): Maybe<T> {
    return f(self.value) ? self : none<T>()
  }

  function toString (): string {
    return `Some(${value})`
  }

  function caseOf<U, V> (c: MaybeCase<T, U, V>): U {
    return c.some(value)
  }

  function orSome<U> (v: U): T {
    return self.value
  }

  function orElse (m: Maybe<T>): Maybe<T> {
    return self
  }

  function defaulting (t: T): Some<T> {
    return self
  }

  function doIt<U> (p: OptionalMaybeCase<T, U>): Maybe<T> {
    if (p.some) {
      p.some(self.value)
    }
    return self
  }

  return Object.freeze(self)
}

export interface None<T> extends Maybe<T> {}
export function none<T> (t?: T): Maybe<T> {
  const value: T = t
  const isSome: boolean = false
  const isNone: boolean = true
  const self: Maybe<T> = {
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
    orSome,
    orElse,
    do: doIt
  }

  function bind<U> (transform: (t: T) => Maybe<U>): Maybe<U> {
    return none()
  }

  function map<U> (transform: (t: T) => U): None<U> {
    return none()
  }

  function unit (v: T): None<T> {
    return none(v)
  }

  function ap<U> (m: Maybe<(t: T) => U>): Maybe<U> {
    return none()
  }

  function join (): T {
    return undefined
  }

  function takeLeft<U> (m: Maybe<U>): Maybe<T | U> {
    return self
  }

  function takeRight<U> (m: Maybe<U>): Maybe<U> {
    return m.isNone ? m : none()
  }

  function filter (f: (t: T) => boolean): Maybe<T> {
    return self
  }

  function toString (): string {
    return `None(${value})`
  }

  function caseOf<U, V> (c: MaybeCase<T, U, V>): V {
    return c.none()
  }

  function defaulting (t: T): Some<T> {
    return some(t)
  }

  function orSome<U> (v: U): U {
    return v
  }

  function orElse (m: Maybe<T>): Maybe<T> {
    return m
  }

  function doIt<U> (p: OptionalMaybeCase<T, U>): Maybe<T> {
    if (p.none) {
      p.none()
    }
    return self
  }

  return Object.freeze(self)
}
