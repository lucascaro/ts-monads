import {Monad} from './Monad'
import {Maybe, none, some} from './Maybe'

export interface EitherCase<L,R,U,V> {
  left(t: L): U
  right(t: R): V
}

export interface Either<L,R> /* extends Monad<?> */{
  isLeft: boolean
  isRight: boolean
  value: L|R
  left(): L
  right(): R
  map<U>(transform: (r: R) => U): Either<L,U>
  bind<U>(transform: (r: R) => Either<U,R>): Either<U,R>
  ap<U>(m: Either<L, (r: R) => U>): Either<L, U>
  join(): L | R
  caseOf<U,V>(c: EitherCase<L,R,U,V>): U | V
  toMaybe(): Maybe<R>
}

export interface Left<L,R> extends Either<L,R> {
  value: L
}
export function left<L,R>(l: L): Either<L,R> {
  const value: L = l
  const isLeft: boolean = true
  const isRight: boolean = false
  const self = {
    isLeft,
    isRight,
    value,
    left: takeLeft,
    right: takeRight,
    bind,
    map,
    ap,
    join,
    caseOf,
    toMaybe,
    toString
  }

  function takeLeft(): L {
    return self.value
  }

  function takeRight(): R {
    throw new Error('No right side on Either.Left')
  }

  function bind(transform: (r: R) => Either<L,R>): Either<L,R> {
    return self
  }
  function map<U>(transform: (r: R) => U): Either<L,U> {
    return left<L,U>(self.value)
  }
  function ap<U>(m: Either<L, (r: R) => U>): Either<L, U> {
    return left<L,U>(self.value)
  }

  function join(): L | R {
    return self.value
  }

  function caseOf<U,V>(c: EitherCase<L,R,U,V>): U | V {
    return c.left(self.value)
  }

  function toMaybe(): Maybe<R> {
    return none<R>()
  }

  function toString(): string {
    return `Left(${self.value})`
  }

  return Object.freeze(self)

}

export interface Right<L,R> extends Either<L,R> {
  value: R
}
export function right<L,R>(r: R): Either<L,R> {
  const isLeft: boolean = false
  const isRight: boolean = true
  const value: R = r

  const self = {
    isLeft,
    isRight,
    value,
    left: takeLeft,
    right: takeRight,
    bind,
    map,
    ap,
    join,
    caseOf,
    toMaybe,
    toString
  }

  function takeLeft(): L {
    throw new Error('No left side on Either.Right')
  }

  function takeRight(): R {
    return self.value
  }

  function bind(transform: (r: R) => Either<L,R>): Either<L,R> {
    return transform(self.value)
  }

  function map<U>(transform: (r: R) => U): Either<L,U> {
    return right<L,U>(transform(self.value))
  }

  function ap<U>(m: Either<L, (r: R) => U>): Either<L, U> {
    return right<L,U>(m.right()(self.value))
  }

  function join(): L | R {
    return self.value
  }

  function caseOf<U,V>(c: EitherCase<L,R,U,V>): U | V {
    return c.right(self.value)
  }

  function toMaybe(): Maybe<R> {
    return some<R>(self.value)
  }

  function toString(): string {
    return `Right(${self.value})`
  }

  return Object.freeze(self)
}
