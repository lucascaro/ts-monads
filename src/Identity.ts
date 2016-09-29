import {Monad} from './Monad'

// Fuck classes
export interface Identity<T> extends Monad<T> {}
export function identity<T>(t: T): Identity<T> {
  const value: T = t
  const self = {
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
  function bind<U>(transform: (T) => Monad<U>): Monad<U> {
    return transform(value)
  }

  function map<U>(transform: (t: T) => U): Identity<U> {
    return identity<U>(transform(value))
  }

  function unit(value: T): Identity<T> {
    return identity<T>(value)
  }

  function ap<U>(m: Monad<((T) => U)>): Identity<U> {
    return identity<U>(m.value(value))
  }

  function join<U extends Monad<T>>(): Monad<T> {
    return bind((i: Monad<T>) => i)
  }

  function takeLeft<U>(m: Monad<U>): Identity<T> {
    return self
  }

  function takeRight<U>(m: Monad<U>): Monad<U> {
    return m
  }

  function toString(): string {
     return `Identity(${value})`;
  }

  return Object.freeze(self)
}
