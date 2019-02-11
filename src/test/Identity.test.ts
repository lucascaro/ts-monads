import { expect } from 'chai'
import * as mlog from 'mocha-logger'
import { identity } from '../Identity'

describe('Identity', function () {
  describe('#constructor()', function () {
    it('creates identity value', function () {
      const m = identity('Hello world')
      mlog.log(m)
      expect(m.value).to.equal('Hello world')
      const i = identity<number>(1)
      mlog.log('id:1', i)
      expect(i.value).to.equal(1)
    })
  })

  describe('#takeLeft()', function () {
    it('returns its own value', function () {
      const r = identity(1).takeLeft(identity(2))
      mlog.log('takeLeft<1,2>:', r)
      expect(r.value).to.eql(1)
    })
  })

  describe('#takeRight()', function () {
    it('returns the given value', function () {
      const r = identity(1).takeRight(identity(2))
      mlog.log('takeRight<1,2>:', r)
      expect(r.value).to.eql(2)
    })
  })

  describe('#bind()', function () {
    it('creates identity value', function () {
      const result = identity(5).bind((value: number) =>
        identity(6).bind((value2: number) => identity(value + value2))
      )

      mlog.log(result)
      expect(result.value).to.eql(11)
    })
  })
})
