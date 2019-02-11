import { err, ok, ResultKind } from '../Result';

describe('Result', () => {
  describe('#kind', () => {
    expect(ok('').kind).toEqual(ResultKind.ok);
    expect(err('').kind).toEqual(ResultKind.err);
  });

  describe('#isOk', () => {
    test('ok is ok', () => {
      expect(ok(1).isOk).toBe(true);
      expect(ok(1).isErr).toBe(false);
    });
    test('err is err', () => {
      expect(err(0).isErr).toBe(true);
      expect(err(0).isOk).toBe(false);
    });
  });

  describe('#ok', () => {
    test('ok is some', () => {
      expect(ok(1).ok().isSome).toBe(true);
      expect(
        ok(1)
          .ok()
          .unwrap(),
      ).toBe(1);
    });
    test('err is none', () => {
      expect(err(0).ok().isNone).toBe(true);
    });
  });

  describe('#err', () => {
    test('err is some', () => {
      expect(err(1).err().isSome).toBe(true);
      expect(
        err(1)
          .err()
          .unwrap(),
      ).toBe(1);
    });
    test('ok is none', () => {
      expect(ok(0).err().isNone).toBe(true);
    });
  });

  describe('#unwrap', () => {
    test('unwrap ok value', () => {
      expect(ok('VAL').unwrap()).toBe('VAL');
    });

    test('throw on err', () => {
      expect(() => err('VAL').unwrap()).toThrow('VAL');
    });
  });

  describe('#unwrapOr', () => {
    test('unwrap ok value', () => {
      expect(ok('VAL').unwrapOr('VAL2')).toBe('VAL');
    });

    test('throw on err', () => {
      expect(err('VAL').unwrapOr('VAL2')).toBe('VAL2');
    });
  });

  describe('#unwrapOrElse', () => {
    test('unwrap ok value', () => {
      expect(ok('VAL').unwrapOrElse(() => 'VAL2')).toBe('VAL');
    });

    test('throw on err', () => {
      expect(err('VAL').unwrapOrElse(() => 'VAL2')).toBe('VAL2');
    });
  });

  describe('#expect', () => {
    test('unwrap ok value', () => {
      expect(ok('VAL').expect('VAL2')).toBe('VAL');
    });

    test('throw on err', () => {
      expect(() => err('VAL').expect('VAL2')).toThrow('VAL2');
    });
  });

  describe('#unwrapErr', () => {
    test('unwrap err value', () => {
      expect(err('VAL').unwrapErr()).toBe('VAL');
    });

    test('throw on ok', () => {
      expect(() => ok('VAL').unwrapErr()).toThrow('VAL');
    });
  });

  describe('#expectErr', () => {
    test('unwrap err value', () => {
      expect(err('VAL').expectErr('VAL2')).toBe('VAL');
    });

    test('throw on ok', () => {
      expect(() => ok('VAL').expectErr('VAL2')).toThrow('VAL2');
    });
  });

  describe('#map', () => {
    test('map ok values', () => {
      expect(
        ok(1)
          .map((x) => x * 2)
          .unwrap(),
      ).toBe(2);
    });

    test('keep err values', () => {
      expect(
        err<number, string>('VAL')
          .map((x) => x * 2)
          .unwrapErr(),
      ).toBe('VAL');
    });
  });

  describe('#mapOrElse', () => {
    test('map ok values', () => {
      expect(
        ok<string, string>('foo').mapOrElse((e) => 'else', (x) => x + x),
      ).toBe('foofoo');
    });

    test('else err values', () => {
      expect(
        err<string, string>('foo').mapOrElse((e) => `else${e}`, (x) => x + x),
      ).toBe('elsefoo');
    });
  });

  describe('#mapErr', () => {
    test('map err values', () => {
      expect(
        err<string, string>('foo')
          .mapErr((e) => `err${e}`)
          .unwrapErr(),
      ).toBe('errfoo');
    });

    test('else err values', () => {
      expect(
        err<string, string>('foo').mapOrElse((e) => `else${e}`, (x) => x + x),
      ).toBe('elsefoo');
    });
  });

  describe('#iter', () => {
    test('ok iterates once', () => {
      const it = ok('VAL').iter();
      expect(Symbol.iterator in it).toBe(true);
      expect(it.next()).toEqual({ value: 'VAL', done: true });
    });

    test('err iterates nonce', () => {
      const it = err('ERR').iter();
      expect(Symbol.iterator in it).toBe(true);
      expect(it.next()).toEqual({ value: undefined, done: true });
    });
  });

  describe('#and', () => {
    test('res if ok', () => {
      expect(
        ok(1)
          .and(ok(2))
          .unwrap(),
      ).toBe(2);

      expect(ok<number, number>(1).and(err(2)).isErr).toBe(true);
    });

    test('own error if err', () => {
      expect(
        err(1)
          .and(ok(2))
          .unwrapErr(),
      ).toBe(1);

      expect(
        err(1)
          .and(err(2))
          .unwrapErr(),
      ).toBe(1);
    });
  });

  describe('#andThen', () => {
    test('res if ok', () => {
      expect(
        ok(1)
          .andThen((v) => ok(v * 2))
          .unwrap(),
      ).toBe(2);

      expect(
        ok<number, number>(1)
          .andThen((v) => err(v * 2))
          .unwrapErr(),
      ).toBe(2);
    });

    test('own error if err', () => {
      expect(
        err(1)
          .andThen(() => ok(2))
          .unwrapErr(),
      ).toBe(1);

      expect(
        err(1)
          .andThen(() => err(2))
          .unwrapErr(),
      ).toBe(1);
    });
  });

  describe('#or', () => {
    test('res if err', () => {
      expect(
        err<number, number>(1)
          .or(ok(2))
          .unwrap(),
      ).toBe(2);

      expect(
        err<number, number>(1)
          .or(err(2))
          .unwrapErr(),
      ).toBe(2);
    });

    test('ok if ok', () => {
      expect(
        ok(1)
          .or(ok(2))
          .unwrap(),
      ).toBe(1);

      expect(
        ok<number, number>(1)
          .or(err(2))
          .unwrap(),
      ).toBe(1);
    });
  });

  describe('#orElse', () => {
    test('res if err', () => {
      expect(
        err<number, number>(1)
          .orElse(() => ok(2))
          .unwrap(),
      ).toBe(2);

      expect(
        err<number, number>(1)
          .orElse(() => err(2))
          .unwrapErr(),
      ).toBe(2);
    });

    test('ok if ok', () => {
      expect(
        ok(1)
          .orElse(() => ok(2))
          .unwrap(),
      ).toBe(1);

      expect(
        ok<number, number>(1)
          .orElse(() => err(2))
          .unwrap(),
      ).toBe(1);
    });
  });
});
