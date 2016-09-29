import {identity} from './Identity'
import {some, none} from './Maybe'
import {left, right} from './Either'

import {expect} from 'chai'

import * as mlog from 'mocha-logger'

describe('identity', function() {
  describe('#constructor()', function() {
    it('creates identity value', function() {
      const m = identity('Hello world')
      mlog.log(m)
      expect(m.value).to.equal('Hello world')
      const i = identity<number>(1)
      mlog.log('id:1', i)
      expect(i.value).to.equal(1)
    })
  })

  describe('#takeLeft()', function() {
    it('returns its own value', function() {
      const r = identity(1).takeLeft(identity(2))
      mlog.log('takeLeft<1,2>:', r)
      expect(r.value).to.eql(1)
    })
  })

  describe('#takeRight()', function() {
    it('returns the given value', function() {
      const r = identity(1).takeRight(identity(2))
      mlog.log('takeRight<1,2>:',r)
      expect(r.value).to.eql(2)
    })
  })

  describe('#bind()', function() {
    it('creates identity value', function() {
      const result = identity(5)
      .bind((value: number) =>
        identity(6).bind((value2: number) =>
          identity(value + value2)))

      mlog.log(result)
      expect(result.value).to.eql(11)
    })
  })

})


describe('Maybe', function() {
  describe('#constructor()', function() {
    it('can create some', function() {
      const s = some('yee')
      mlog.log(s)
      expect(s.value).to.equal('yee')
    })
    it('can create none', function() {
      const n = none('no-no')
      mlog.log(n)
      expect(n.value).to.equal('no-no')
    })
  })
  describe('#bind()', function (){
    it('maps some to some', function() {
      const r = some(4).bind(value1 =>
        some(3).bind(value2 =>
          some(value1 + value2)
        )
      )
      mlog.log(r)
      expect(r.value).to.eql(7)
      expect(r.isSome)
      expect(!r.isNone)
    })

    it('breaks on none', function(){
      const r = some(4).bind(value1 =>
        none('Error!').bind(value2 =>
          some(value1 + value2)
        )
      )
      mlog.log(r)
      expect(r.value).to.eql('Error!')
      expect(!r.isSome)
      expect(r.isNone)
    })
  })
  describe('#map()', function() {
    it('maps a single some', function() {
      const r = some(4).map(value => value * 2)
      mlog.log(r)
      expect(r.value).to.eql(8)
      expect(r.isSome)
      const s = some('hello').map(value => value.toUpperCase())
      mlog.log(s)
      expect(s.value).to.eql('HELLO')
      expect(s.isSome)
    })
    it('can chain maps', function() {
      const r = some('INitial TexT')
        .map(v => v.toLowerCase())
        .map(v => v.split(' '))
        .map(v => v.map(v => v.slice(0,1).toUpperCase() + v.slice(1)))
        .map(v => v.join('_'))
      mlog.log(r)
      expect(r.value).to.eql('Initial_Text')
    })
    it('can break out of chains', function() {
      const r = some('Initial Text')
        .map(v => v.toUpperCase())
        .bind<string>(v => none('Error'))
        .map(v => v.replace(' ', '_'))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.eql('Error')
    })
  })

  describe('#ap()', function(){
    // TODO:
    it('applies transforms', function() {
      const r = some(1).ap(
        some((a => String(a)))
      )
      mlog.log(r)
      expect(r.value).to.equal('1')
      expect(r.value).to.be.a('string')
    })
    it('does things', function() {
      const r = some(1)
        .ap(none((a => String(a))))
        .map(e => 'This never happens') // this is wrong
      mlog.log(r)
      expect(r.isNone)
    })
  })

  describe('#join()', function(){
    it('applies transforms', function() {
      mlog.log('-- join --')
      // Todo: this fails
    })
  })
  describe('#takeLeft()', function(){
    it('returns left monad on <some,some>', function() {
      const r = some(1).takeLeft(some(2))
      mlog.log(r)
      expect(r.isSome)
      expect(r.value).to.equal(1)
    })

    it('returns none on <some,none>', function() {
      const r = some(1).takeLeft(none('Error'))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.equal('Error')
    })

    it('returns none on <none,some>', function() {
      const r = none('Error').takeLeft(some(2))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.equal('Error')
    })

    it('returns none on <none,none>', function() {
      const r = none('Error').takeLeft(none('Error2'))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.equal('Error')
    })
  })

  describe('#takeRight()', function(){
    it('returns right monad on <some,some>', function() {
      const r = some(1).takeRight(some(2))
      mlog.log(r)
      expect(r.isSome)
      expect(r.value).to.equal(2)
    })

    it('returns none on <some,none>', function() {
      const r = some(1).takeRight(none('Error'))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.equal('Error')
    })

    it('returns none on <none,some>', function() {
      const r = none('Error').takeRight(some(2))
      mlog.log(r)
      expect(r)
    })

    it('returns none on <none,none>', function() {
      const r = none('Error').takeRight(none('Error2'))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.equal('Error')
    })
  })

  describe('#caseOf', function() {
    const cases = {
      some: n => n * 2,
      none: n => 'Error'
    }
    it('uses some', function(){
      const r = some(10).caseOf(cases)
      mlog.log(r)
      expect(r).to.equal(20)
    })
    it('uses none', function(){
      const r = none(10).caseOf(cases)
      mlog.log(r)
      expect(r).to.equal('Error')
    })
  })

  describe('Maybe in the real world', function() {
    // Maybe real world example
    type User = {
      name: string,
      getAvatar: () => Maybe<Avatar>
    }

    type Avatar = {
      type: string
      getURL: () => Maybe<string>
    }
    function getUser(urlResponse): Maybe<User> {
      return some({
        name: 'The User',
        getAvatar: () => some({
          type: 'url',
          getURL: () => urlResponse
          // getURL: () => none('No avatar found')
        })
      })
    }
    it('returns some url', function(){
      let url = getUser(some('a url'))
        .bind(user => user.getAvatar())
        .bind(avatar => avatar.getURL())
        .bind(url => some(`URL is ${url}`))

      mlog.log(url)
      expect(url.isSome)
      expect(url.value).to.eql('URL is a url')
    })
    it('fails on none url', function(){
      let url = getUser(none('error'))
        .bind(user => user.getAvatar())
        .bind(avatar => avatar.getURL())
        .bind(url => some(`URL is ${url}`))

      mlog.log(url)
      expect(url.isNone)
      expect(url.value).to.eql('error')
    })
  })
})


describe('Either', function(){
  describe('#constructor()', function(){
    it('creates a left value', function(){
      mlog.log(right('r'))
    })
    it('creates a right value', function(){
      mlog.log(left('l'))
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

