//

export interface Monad<T> {
  value: T

  // constructor(v: T)
  /**
   * bind(unit(x), f) ≡ f(x)
   * bind(m, unit) ≡ m
   * bind(bind(m, f), g) ≡ bind(m, x ⇒ bind(f(x), g))
   */
  bind<U>(transform: (T) => Monad<U>): Monad<U>
  map<U>(transform: (T) => U): Monad<U>
  unit(value: T): Monad<T>
  ap<U>(m: Monad<((T) => U)>): Monad<U>
  join<U extends Monad<T>>(): Monad<T>
  takeLeft<U>(m: Monad<U>): Monad<T>
  takeRight<U>(m: Monad<U>): Monad<U>
  toString(): string
}


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

export interface Either<L,R> {
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
