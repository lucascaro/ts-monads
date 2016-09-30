import {left, right} from '../Either'

import {expect} from 'chai'

import * as mlog from 'mocha-logger'


describe('Either', function(){
  describe('#constructor()', function(){
    it('creates a left value', function(){
      const l = left('l')
      mlog.log(l)
      expect(l.isLeft)
      expect(!l.isRight)
      expect(l.value).to.equal('l')
    })
    it('creates a right value', function(){
      const r = right('r')
      mlog.log(r)
      expect(!r.isLeft)
      expect(r.isRight)
      expect(r.value).to.equal('r')
    })
  })
  describe('#map()', function(){
    it('maps right + right', function(){
      mlog.log(right('r').map((r: string) => right('Succ')))
    })
    it('maps left + right', function(){
      mlog.log(left('error').map((r: string) => right('Error')))
    })
  })
})

