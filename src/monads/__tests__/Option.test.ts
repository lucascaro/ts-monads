import { none, Option, OptionKind, some } from '../Option';

describe('Option', () => {
  describe('#kind', () => {
    expect(some('').kind).toEqual(OptionKind.some);
    expect(none().kind).toEqual(OptionKind.none);
  });
  describe('#isSome', () => {
    test('some is some', () => {
      expect(some(1).isSome).toBe(true);
      expect(some(1).isNone).toBe(false);
    });
    test('none is none', () => {
      expect(none().isNone).toBe(true);
      expect(none().isSome).toBe(false);
    });
  });

  describe('#expect', () => {
    test('some returns value', () => {
      expect(some('VAL').expect('grr')).toBe('VAL');
    });
    test('none throws with message', () => {
      expect(() => none().expect('grr')).toThrowError('grr');
    });
  });

  describe('#unwrap', () => {
    test('some returns value', () => {
      expect(some('VAL').unwrap()).toBe('VAL');
    });
    test('none throws with message', () => {
      expect(() => none().unwrap()).toThrowError();
    });
  });

  describe('#unwrapOr', () => {
    test('some returns value', () => {
      expect(some('VAL').unwrapOr('default')).toBe('VAL');
    });
    test('returns default when none', () => {
      expect(none().unwrapOr('default')).toBe('default');
    });
  });

  describe('#unwrapOrElse', () => {
    test('some returns value', () => {
      expect(some('VAL').unwrapOrElse(() => 'default')).toBe('VAL');
    });
    test('none runs function and returns', () => {
      expect(none().unwrapOrElse(() => 'default')).toBe('default');
    });
  });

  describe('#map', () => {
    test('some maps value', () => {
      expect(
        some('VAL')
          .map((v) => `${v}mapped`)
          .unwrap(),
      ).toBe('VALmapped');
    });

    test('none maps to none', () => {
      expect(none().map((v) => `${v}mapped`).isNone).toBe(true);
    });
  });

  describe('#mapOr', () => {
    test('some maps value', () => {
      expect(some('VAL').mapOr('default', (v) => `${v}mapped`)).toBe(
        'VALmapped',
      );
    });

    test('none maps to default', () => {
      expect(none().mapOr('default', (v) => `${v}mapped`)).toBe('default');
    });
  });

  describe('#mapOrElse', () => {
    test('some maps value', () => {
      expect(some('VAL').mapOrElse(() => 'default', (v) => `${v}mapped`)).toBe(
        'VALmapped',
      );
    });

    test('none runs default', () => {
      expect(none().mapOrElse(() => 'default', (v) => `${v}mapped`)).toBe(
        'default',
      );
    });
  });

  describe('#okOr', () => {
    test('some maps value', () => {
      expect(
        some('VAL')
          .okOr('err')
          .unwrap(),
      ).toBe('VAL');
    });

    test('none runs default', () => {
      expect(
        none()
          .okOr('ERR')
          .unwrapErr(),
      ).toBe('ERR');
    });
  });

  describe('#okOrElse', () => {
    test('some maps value', () => {
      expect(
        some('VAL')
          .okOrElse(() => 'err')
          .unwrap(),
      ).toBe('VAL');
    });

    test('none runs default', () => {
      expect(
        none()
          .okOrElse(() => 'ERR')
          .unwrapErr(),
      ).toBe('ERR');
    });
  });

  describe('#iter', () => {
    test('some iterates once', () => {
      const it = some('VAL').iter();
      expect(Symbol.iterator in it).toBe(true);
      expect(it.next()).toEqual({ value: 'VAL', done: true });
    });

    test('none iterates nonce', () => {
      const it = none().iter();
      expect(Symbol.iterator in it).toBe(true);
      expect(it.next()).toEqual({ value: undefined, done: true });
    });
  });

  describe('#and', () => {
    test('returns optb if the option is some', () => {
      expect(
        some('VAL1')
          .and(some('VAL2'))
          .unwrap(),
      ).toBe('VAL2');

      expect(some('VAL1').and(none()).isNone).toBe(true);
    });

    test('returns none if the option is none', () => {
      expect(none().and(some('VAL2')).isNone).toBe(true);
      expect(none().and(none()).isNone).toBe(true);
    });
  });

  describe('#andThen', () => {
    test('calls f if the option is some', () => {
      expect(
        some('VAL1')
          .andThen(() => some('VAL2'))
          .unwrap(),
      ).toBe('VAL2');
    });

    test('returns none if the option is none', () => {
      expect(none().andThen(() => some('VAL2')).isNone).toBe(true);
    });
  });

  describe('#filter', () => {
    test('returns some if the predicate is true', () => {
      expect(
        some('VAL1')
          .filter(() => true)
          .unwrap(),
      ).toBe('VAL1');
    });

    test('returns none if the predicate is false', () => {
      expect(some('VAL1').filter(() => false).isNone).toBe(true);
    });

    test('returns none if the option is none', () => {
      expect(none().filter(() => true).isNone).toBe(true);

      expect(none().filter(() => false).isNone).toBe(true);
    });
  });

  describe('#or', () => {
    test('returns self if the option is some', () => {
      expect(
        some('VAL1')
          .or(some('VAL2'))
          .unwrap(),
      ).toBe('VAL1');

      expect(
        some('VAL1')
          .or(none())
          .unwrap(),
      ).toBe('VAL1');
    });

    test('returns optb if the option is none', () => {
      expect(
        none<string>()
          .or(some('VAL2'))
          .unwrap(),
      ).toBe('VAL2');

      expect(none().or(none()).isNone).toBe(true);
    });
  });

  describe('#orElse', () => {
    test('returns self if the option is some', () => {
      expect(
        some('VAL1')
          .orElse(() => some('VAL2'))
          .unwrap(),
      ).toBe('VAL1');

      expect(
        some('VAL1')
          .orElse(() => none())
          .unwrap(),
      ).toBe('VAL1');
    });

    test('runs f if the option is none', () => {
      expect(
        none<string>()
          .orElse(() => some('VAL2'))
          .unwrap(),
      ).toBe('VAL2');

      expect(none().orElse(() => none()).isNone).toBe(true);
    });
  });

  describe('#xor', () => {
    test('returns self if some and optb is none ', () => {
      expect(
        some('VAL1')
          .xor(none())
          .unwrap(),
      ).toBe('VAL1');
    });

    test('returns optb if none and optb is some ', () => {
      expect(
        none<string>()
          .xor(some('VAL1'))
          .unwrap(),
      ).toBe('VAL1');
    });

    test('returns none if both are some', () => {
      expect(some('VAL1').xor(some('VAL2')).isNone).toBe(true);
    });

    test('returns none if both are none', () => {
      expect(none().xor(none()).isNone).toBe(true);
    });
  });

  test('Exhaustiveness checking', () => {
    function assertNever(x: never): never {
      throw new Error(`Unexpected object: ${x}`);
    }
    // Removing any of the first two cases makes the compiler complain.
    function getIt(o: Option<string>) {
      switch (o.kind) {
        case OptionKind.some:
          return 'some';
        case OptionKind.none:
          return 'none';
        default:
          return assertNever(o);
      }
    }
    expect(getIt(some('SOME'))).toBe('some');
    expect(getIt(none())).toBe('none');
  });
});
