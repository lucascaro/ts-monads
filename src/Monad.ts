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
