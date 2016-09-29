import {Monad} from './Monad'

export interface Either<L,R> /* extends Monad<?> */{
  isLeft: boolean
  isRight: boolean

  // constructor(left: L, right: R)
  left(): L
  right(): R
  bind<U>(transform: (r: R) => Either<U,R>): Either<U,R>
  map<U>(transform: (r: R) => Either<U,R>): Either<U,R>
}

export interface Left<L,R> extends Either<L,R> {}
export function left<L,R>(l: L): Either<L,R> {
  const value: L = l
  const isLeft: boolean = true
  const isRight: boolean = false
  const self = {
    isLeft,
    isRight,
    value,
    left,
    right,
    bind,
    map,
    toString
  }

  function left(): L {
    return value
  }

  function right(): R {
    throw new Error('No right side on Either.Left')
  }

  function bind(transform: (r: R) => Either<L,R>): Either<L,R> {
    return self
  }
  function map(transform: (r: R) => Either<L,R>): Either<L,R> {
    return self
  }
  function toString(): string {
    return `Left(${value})`
  }

  return Object.freeze(self)

}

export interface Right<L,R> extends Either<L,R> {}
export function right<L,R>(r: R): Either<L,R> {
  const isLeft: boolean = false
  const isRight: boolean = true
  const value: R = r

  const self = {
    isLeft,
    isRight,
    value,
    left,
    right,
    bind,
    map,
    toString
  }

  function left(): L {
    throw new Error('No left side on Either.Right')
  }

  function right(): R {
    return value
  }

  function bind(transform: (r: R) => Either<L,R>): Either<L,R> {
    return transform(value)
  }
  function map(transform: (r: R) => Either<L,R>): Either<L,R> {
    return transform(value)
  }
  function toString(): string {
    return `Right(${value})`
  }

  return Object.freeze(self)
}
