import { Monad } from './Monad'

// Fuck classes
export interface Identity<T> extends Monad<T> {
  takeLeft<U> (m: Monad<U>): Identity<T | U>
  takeRight<U> (m: Monad<U>): Monad<U>
}
export function identity<T> (t: T): Identity<T> {
  const value: T = t
  const self: Identity<T> = {
    value,
    bind,
    map,
    unit,
    ap,
    join,
    takeLeft,
    takeRight,
    toString
  }
  function bind<U> (transform: (T) => Monad<U>): Monad<U> {
    return transform(value)
  }

  function map<U> (transform: (t: T) => U): Identity<U> {
    return identity<U>(transform(value))
  }

  function unit (value: T): Identity<T> {
    return identity<T>(value)
  }

  function ap<U> (m: Monad<(T) => U>): Identity<U> {
    return identity<U>(m.value(value))
  }

  function join (): T {
    return self.value
  }

  function takeLeft<U> (m: Monad<U>): Identity<T> {
    return self
  }

  function takeRight<U> (m: Monad<U>): Monad<U> {
    return m
  }

  function toString (): string {
    return `Identity(${value})`
  }

  return Object.freeze(self)
}
