//

export interface Monad<T> {
  value: T

  // constructor(v: T)
  /**
   * bind(unit(x), f) ≡ f(x)
   * bind(m, unit) ≡ m
   * bind(bind(m, f), g) ≡ bind(m, x ⇒ bind(f(x), g))
   */
  bind<U>(transform: (t: T) => Monad<U>): Monad<U>
  map<U>(transform: (t: T) => U): Monad<U>
  unit(value: T): Monad<T>
  ap<U>(m: Monad<((T) => U)>): Monad<U>
  join(): T
  toString(): string
}
