import { none, Option, some } from './Option';

export type Result<T, E> = Ok<T, E> | Err<T, E>;
export enum ResultKind {
  ok = 'ok',
  err = 'err',
}

export interface Ok<T, E> extends IResult<T, E> {
  kind: ResultKind.ok;
  isOk: true;
  isErr: false;
}
export interface Err<T, E> extends IResult<T, E> {
  kind: ResultKind.err;
  isOk: false;
  isErr: true;
}
export default interface IResult<T, E> {
  kind: ResultKind;
  // Returns true if the result is Ok.
  isOk: boolean;

  // Returns true if the result is Err.
  isErr: boolean;

  // Converts from Result<T, E> to Option<T>.
  ok: () => Option<T>;

  // Converts from Result<T, E> to Option<E>.
  err: () => Option<E>;

  // Maps a Result<T, E> to Result<U, E> by applying a function to a contained
  //  Ok value, leaving an Err value untouched.
  map: <U>(fn: (t: T) => U) => Result<U, E>;

  // Maps a Result<T, E> to U by applying a function to a contained Ok value,
  // or a fallback function to a contained Err value.
  mapOrElse: <U>(fallback: (e: E) => U, fn: (t: T) => U) => U;

  // Maps a Result<T, E> to Result<T, F> by applying a function to a contained
  // Err value, leaving an Ok value untouched.
  mapErr: <F>(op: (e: E) => F) => Result<T, F>;

  // Returns an iterator over the possibly contained value.
  iter: () => Iterator<T>;

  // Returns res if the result is Ok, otherwise returns the Err value of self.
  and: <U>(res: Result<U, E>) => Result<U, E>;

  // Calls op if the result is Ok, otherwise returns the Err value of self.
  andThen: <U>(res: (t: T) => Result<U, E>) => Result<U, E>;

  // Returns res if the result is Err, otherwise returns the Ok value of self.
  or: <F>(res: Result<T, F>) => Result<T, F>;

  // Calls op if the result is Err, otherwise returns the Ok value of self.
  orElse: <F>(res: (e: E) => Result<T, F>) => Result<T, F>;

  // Unwraps a result, yielding the content of an Ok.
  unwrap: () => T;

  // Unwraps a result, yielding the content of an Ok. Else, it returns optb.
  unwrapOr: (optb: T) => T;

  // Unwraps a result, yielding the content of an Ok. If the value is an Err
  // then it calls op with its value.
  unwrapOrElse: (optb: (e: E) => T) => T;

  // Unwraps a result, yielding the content of an Ok.
  expect: (msg: string) => T;

  // Unwraps a result, yielding the content of an Err.
  unwrapErr: () => E;

  // Unwraps a result, yielding the content of an Err.
  expectErr: (msg: string) => E;

  // Transposes a Result of an Option into an Option of a Result.
  transpose: () => Option<Result<T, E>>;
}

export function ok<T, E>(value: T): Ok<T, E> {
  const self: Ok<T, E> = {
    kind: ResultKind.ok,
    isOk: true,
    isErr: false,
    ok: () => some(value),
    err: () => none(),
    map: (fn) => ok(fn(value)),
    mapOrElse: (fallback, fn) => fn(value),
    mapErr: () => ok(value),
    *iter() {
      return value;
    },
    and: (res) => res,
    andThen: (fn) => fn(value),
    or: () => ok(value),
    orElse: () => ok(value),
    unwrap: () => value,
    unwrapOr: () => value,
    unwrapOrElse: () => value,
    expect: () => value,
    unwrapErr: () => {
      throw new Error(String(value));
    },
    expectErr: (msg: string) => {
      throw new Error(msg);
    },
    transpose: () => {
      throw new Error('not implemented');
    },
  };

  return Object.freeze(self);
}
export function err<T, E>(value: E): Result<T, E> {
  const self: Result<T, E> = {
    kind: ResultKind.err,
    isOk: false,
    isErr: true,
    ok: () => none(),
    err: () => some(value),
    map: () => err(value),
    mapOrElse: (fallback) => fallback(value),
    mapErr: (fn) => err(fn(value)),
    *iter(): Iterator<T> {},
    and: () => err(value),
    andThen: () => err(value),
    or: (res) => res,
    orElse: (fn) => fn(value),
    unwrap: () => {
      throw new Error(String(value));
    },
    unwrapOr: (optb) => optb,
    unwrapOrElse: (fn) => fn(value),
    expect: (msg) => {
      throw new Error(msg);
    },
    unwrapErr: () => value,
    expectErr: () => value,
    transpose: () => {
      throw new Error('not implemented');
    },
  };

  return Object.freeze(self);
}
