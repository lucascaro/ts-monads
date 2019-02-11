import Result, { err, ok } from './Result';

export type Option<T> = Some<T> | None<T>;

export enum OptionKind {
  some = 'some',
  none = 'none',
}

export interface Some<T> extends IOption<T> {
  kind: OptionKind.some;
  isSome: true;
  isNone: false;
}
export interface None<T> extends IOption<T> {
  kind: OptionKind.none;
  isSome: false;
  isNone: true;
}

interface IOption<T> {
  kind: OptionKind;
  // true if the option is a Some value.
  isSome: boolean;

  // true if the option is a None value.
  isNone: boolean;

  // Unwraps an option, yielding the content of a Some.
  expect: (msg: string) => T;

  // Moves the value v out of the Option < T > if it is Some(v).
  unwrap: () => T;

  // Returns the contained value or a default.
  unwrapOr: (defVal: T) => T;

  // Returns the contained value or computes it from a closure.
  unwrapOrElse: (fn: () => T) => T;

  // Maps an Option<T> to Option<U> by applying a function to a contained value.
  map: <U>(fn: (t: T) => U) => Option<U>;

  // Applies a function to the contained value (if any), or returns the provided default (if not).
  mapOr: <U>(defVal: U, fn: (t: T) => U) => U;

  // Applies a function to the contained value (if any), or computes a default (if not).
  mapOrElse: <U>(def: () => U, fn: (t: T) => U) => U;

  // Transforms the Option<T> into a Result<T, E>, mapping Some(v) to Ok(v) and None to Err(err).
  okOr: <E>(e: E) => Result<T, E>;

  // Transforms the Option<T> into a Result<T, E>, mapping Some(v) to Ok(v) and None to Err(err()).
  okOrElse: <E>(fn: () => E) => Result<T, E>;

  // Returns an iterator over the possibly contained value.
  iter: () => Iterator<T>;

  // Returns None if the option is None, otherwise returns optb.
  and: <U>(optb: Option<U>) => Option<U>;

  // Returns None if the option is None, otherwise calls f with the wrapped value and
  // returns the result.
  andThen: <U>(fn: (t: T) => Option<U>) => Option<U>;

  // Returns None if the option is None, otherwise calls predicate with
  // the wrapped value and returns:
  // - Some(t) if predicate returns true (where t is the wrapped value), and
  // - None if predicate returns false.
  filter: (predicate: (t: T) => boolean) => Option<T>;

  // Returns the option if it contains a value, otherwise returns optb.
  or: (optb: Option<T>) => Option<T>;

  // Returns the option if it contains a value, otherwise calls f and returns the result.
  orElse: (optb: () => Option<T>) => Option<T>;

  // Returns Some if exactly one of self, optb is Some, otherwise returns None.
  xor: (optb: Option<T>) => Option<T>;

  // Transposes an Option of a Result into a Result of an Option.
  // None will be mapped to Ok(None).
  // Some(Ok(_)) and Some(Err(_)) will be mapped to Ok(Some(_)) and Err(_).
  // transpose: <R, E>() => T extends Result<R, E> ? Result<Option<R>, E> : never;
  transpose: <R, E>() => Result<Option<R>, E> | never;
}

export function some<T>(value: T): Some<T> {
  const self: Some<T> = {
    kind: OptionKind.some,
    isSome: true,
    isNone: false,
    expect: () => value,
    unwrap: () => value,
    unwrapOr: () => value,
    unwrapOrElse: () => value,
    map: (fn) => some(fn(value)),
    mapOr: (defVal, fn) => fn(value),
    mapOrElse: (def, fn) => fn(value),
    okOr: () => ok(value),
    okOrElse: () => ok(value),
    *iter() {
      return value;
    },
    and: (optb) => optb,
    andThen: (fn) => fn(value),
    filter: (fn) => (fn(value) ? some(value) : none()),
    or: () => some(value),
    orElse: () => some(value),
    xor: (optb) => (optb.isNone ? some(value) : none()),
    transpose: () => {
      throw new Error('not implemented');
    },
    // transpose: () => value.replace(value.unwrap),
  };

  return Object.freeze(self);
}

export function none<T>(): None<T> {
  const self: None<T> = {
    kind: OptionKind.none,
    isSome: false,
    isNone: true,
    expect: (msg) => {
      throw new Error(msg);
    },
    unwrap: () => {
      throw new Error('Attemted to unwrap None');
    },
    unwrapOr: (defVal) => defVal,
    unwrapOrElse: (fn) => fn(),
    map: () => none(),
    mapOr: (defVal) => defVal,
    mapOrElse: (def) => def(),
    okOr: <E>(e: E) => err<T, E>(e),
    okOrElse: (fn) => err(fn()),
    *iter(): Iterator<T> {},
    and: () => none(),
    andThen: () => none(),
    filter: () => none(),
    or: (optb) => optb,
    orElse: (fn) => fn(),
    xor: (optb) => (optb.isSome ? optb : none()),
    transpose: () => {
      throw new Error('not implemented');
    },
    // transpose: () => ok(none()),
  };

  return Object.freeze(self);
}
