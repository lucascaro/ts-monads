import { expect } from 'chai'
import * as mlog from 'mocha-logger'
import { EitherCase, left, right } from '../Either'
import { Maybe } from '../Maybe'

describe('Either', function () {
  describe('#constructor()', function () {
    it('creates a left value', function () {
      const l = left('l')
      mlog.log(l)
      expect(l.isLeft)
      expect(!l.isRight)
      expect(l.value).to.equal('l')
    })
    it('creates a right value', function () {
      const r = right('r')
      mlog.log(r)
      expect(!r.isLeft)
      expect(r.isRight)
      expect(r.value).to.equal('r')
    })
  })

  describe('#left()', function () {
    it('returns left value when left', function () {
      const l = left('error')
      mlog.log(l)
      expect(l.left()).to.equal('error')
    })
    it('throws when right', function () {
      const l = right('some value')
      mlog.log(l)
      expect(l.left).to.throw()
    })
  })

  describe('#right()', function () {
    it('returns right value when right', function () {
      const r = right('some value')
      mlog.log(r)
      expect(r.right()).to.equal('some value')
    })

    it('throws when left', function () {
      const l = left('error')
      mlog.log(l)
      expect(l.right).to.throw()
    })
  })

  describe('#map()', function () {
    it('maps right + right', function () {
      const r = right('r1')
      const f = (r: string) => r + ' Succ'
      const m = r.map(f)
      mlog.log(m)
      expect(m.isRight)
      expect(m.value).to.equal('r1 Succ')
    })
    it('maps left + right', function () {
      const l = left('error')
      const f = (r: string) => r + ' Succ'
      const m = l.map(f)
      mlog.log(m)
      expect(m.isLeft)
      expect(m.value).to.equal(l.value)
    })
  })

  describe('#bind()', function () {
    it('chains right + right', function () {
      const r = right('r1')
      const f = (r: string) => right(r + ' Succ')
      const m = r.bind(f)
      mlog.log(m)
      expect(m.isRight)
      expect(m.value).to.equal('r1 Succ')
    })
    it('chains left + right', function () {
      const l = left('error')
      const f = (r: string) => right(r + ' Succ')
      const m = l.bind(f)
      mlog.log(m)
      expect(m.isLeft)
      expect(m.value).to.equal(l.value)
    })
  })

  describe('#ap()', function () {
    it('applies function on the right side', function () {
      const r = right('r1')
      const f = right((r: string) => r + ' Succ')
      const m = r.ap(f)
      mlog.log(m)
      expect(m.isRight)
      expect(m.value).to.equal('r1 Succ')
    })
    it('does not apply right fn on left either', function () {
      const l = left<string, string>('error')
      const f = right<string, (s: string) => string>(
        (r: string) => r + ' Succ'
      )
      const m = l.ap(f)
      mlog.log(m)
      expect(m.isLeft)
      expect(m.value).to.equal(l.value)
    })
  })

  describe('#join()', function () {
    it('joins right, returning the value', function () {
      const r = right('r1')
      const j = r.join()
      mlog.log(j)
      expect(j).to.equal('r1')
    })
    it('joins left, returning an error', function () {
      const l = left(new Error('error'))
      const j = l.join()
      mlog.log(j)
      expect(j).to.be.a('error')
      expect((j as Error).message).to.equal('error')
    })
  })

  describe('#caseOf()', function () {
    const l = left<Error, number>(new Error('test'))
    const r = right<Error, number>(10)
    const cases: EitherCase<Error, number, string, number> = {
      left: (e: Error) => 'Error! ' + e.message,
      right: (x: number) => x + 1
    }
    it('runs right case', function () {
      const result = r.caseOf(cases)
      mlog.log(result)
      expect(result).to.equal(11)
    })

    it('runs left case', function () {
      const result = l.caseOf(cases)
      mlog.log(result)
      expect(result).to.equal('Error! test')
    })
  })

  describe('#toMaybe()', function () {
    it('right returns some', function () {
      const r = right<Error, number>(10)
      const m: Maybe<number> = r.toMaybe()
      mlog.log(m)
      expect(m.isSome)
      expect(m.value).to.equal(10)
    })

    it('left returns a none', function () {
      const l = left<Error, number>(new Error('test'))
      const m: Maybe<number> = l.toMaybe()
      mlog.log(m)
      expect(m.isNone)
    })
  })
})
