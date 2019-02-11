import { expect } from 'chai'
import * as mlog from 'mocha-logger'
import { Maybe, none, some } from '../Maybe'

describe.only('Maybe', function () {
  describe('#constructor()', function () {
    it('can create some', function () {
      const s = some('yee')
      mlog.log(s)
      expect(s.value).to.equal('yee')
    })
    it('can create none', function () {
      const n = none('no-no')
      mlog.log(n)
      expect(n.value).to.equal('no-no')
    })
  })
  describe('#bind()', function () {
    it('maps some to some', function () {
      const r = some(4).bind(value1 =>
        some(3).bind(value2 => some(value1 + value2))
      )
      mlog.log(r)
      expect(r.value).to.eql(7)
      expect(r.isSome)
      expect(!r.isNone)
    })

    it('breaks on none', function () {
      const r = some(4).bind(value1 =>
        none('Error!').bind(value2 => some(value1 + value2))
      )
      mlog.log(r)
      expect(!r.isSome)
      expect(r.isNone)
    })
  })

  describe('#map()', function () {
    it('maps a single some', function () {
      const r = some(4).map(value => value * 2)
      mlog.log(r)
      expect(r.value).to.eql(8)
      expect(r.isSome)
      const s = some('hello').map(value => value.toUpperCase())
      mlog.log(s)
      expect(s.value).to.eql('HELLO')
      expect(s.isSome)
    })
    it('can chain maps', function () {
      const r = some('INitial TexT')
        .map(v => v.toLowerCase())
        .map(v => v.split(' '))
        .map(v => v.map(v => v.slice(0, 1).toUpperCase() + v.slice(1)))
        .map(v => v.join('_'))
      mlog.log(r)
      expect(r.value).to.eql('Initial_Text')
    })
    it('can break out of chains', function () {
      const r = some('Initial Text')
        .map(v => v.toUpperCase())
        .bind<string>(v => none('E r r o r'))
        .map(v => (expect(false), v.replace(' ', '_')))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.eql('E r r o r')
    })
    it('mapping nothing returns nothing', function () {
      const n = none().map(i => 'wat')
      mlog.log(n)
      expect(n.isNone)
      expect(n.value).to.be.undefined
    })
  })

  describe('#ap()', function () {
    it('applies transforms for some', function () {
      const r = some(1)
        .ap(some((a: number) => String(a)))
        .ap(some((a: string) => a.toUpperCase()))
      mlog.log(r)
      expect(r.value).to.equal('1')
      expect(r.value).to.be.a('string')
    })
    it('returns none if the transform returns none', function () {
      const r = some(1)
        .ap(none(a => 0))
        .ap(some(v => (expect(false), 'This never happens')))
        .map(e => (expect(false), 'This never happens'))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.be.undefined
    })
  })

  describe('#join()', function () {
    it('unwraps some', function () {
      const v = some('le value').join()
      mlog.log(v)
      expect(v).to.equal('le value')
    })

    it('unwraps none', function () {
      const v = none().join()
      mlog.log(v)
      expect(v).to.be.undefined
    })
  })
  describe('#takeLeft()', function () {
    it('returns left monad on <some,some>', function () {
      const r = some(1).takeLeft(some(2))
      mlog.log(r)
      expect(r.isSome)
      expect(r.value).to.equal(1)
    })

    it('returns none on <some,none>', function () {
      const r = some(1).takeLeft(none('Error'))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.equal('Error')
    })

    it('returns none on <none,some>', function () {
      const r = none('Error').takeLeft(some(2))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.equal('Error')
    })

    it('returns none on <none,none>', function () {
      const r = none('Error').takeLeft(none('Error2'))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.equal('Error')
    })
  })

  describe('#takeRight()', function () {
    it('returns right monad on <some,some>', function () {
      const r = some(1).takeRight(some(2))
      mlog.log(r)
      expect(r.isSome)
      expect(r.value).to.equal(2)
    })

    it('returns none on <some,none>', function () {
      const r = some(1).takeRight(none('Error'))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.equal('Error')
    })

    it('returns none on <none,some>', function () {
      const r = none('Error').takeRight(some(2))
      mlog.log(r)
      expect(r)
    })

    it('returns none on <none,none>', function () {
      const r = none('Error').takeRight(none('Error2'))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.equal('Error')
    })
  })

  describe('#caseOf()', function () {
    const cases = {
      some: n => n * 2,
      none: () => -1
    }
    it('uses some', function () {
      const r = some(10).caseOf(cases)
      mlog.log(r)
      expect(r).to.equal(20)
    })
    it('uses none', function () {
      const r = none(10).caseOf(cases)
      mlog.log(r)
      expect(r).to.equal(-1)
    })
  })

  describe('#orSome()', function () {
    it('returns first value if some', function () {
      const r = some('value1').orSome('other value')
      mlog.log(r)
      expect(r).to.equal('value1')
    })

    it('returns second value if none', function () {
      const r = none('value1').orSome('other value')
      mlog.log(r)
      expect(r).to.equal('other value')
    })
  })

  describe('#orElse()', function () {
    it('returns first maybe if some', function () {
      const r = some('value1').orElse(some('other value'))
      mlog.log(r)
      expect(r.isSome)
      expect(r.value).to.equal('value1')
    })

    it('returns second maybe if none', function () {
      const r = none('value1').orElse(some('other value'))
      mlog.log(r)
      expect(r.isNone)
      expect(r.value).to.equal('other value')
    })
  })

  describe('#filter()', function () {
    it('returns value if true', function () {
      const r = some('value1').filter(i => i === 'value1')
      mlog.log(r)
      expect(r.isSome)
      expect(r.value).to.equal('value1')
    })

    it('returns none if false', function () {
      const r = some('value1').filter(i => i !== 'value1')
      mlog.log(r)
      expect(r.isNone)
    })

    it('returns none if none', function () {
      const r1 = none('value1').filter(i => true)
      const r2 = none('value1').filter(i => false)
      mlog.log(r1)
      mlog.log(r2)
      expect(r1.isNone)
      expect(r2.isNone)
    })
  })

  describe('#defaulting()', function () {
    it('returns original if some', function () {
      const r = some('value1').defaulting('default')
      mlog.log(r)
      expect(r.isSome)
      expect(r.value).to.equal('value1')
    })

    it('returns default if none', function () {
      const r = none('value1').defaulting('default')
      mlog.log(r)
      expect(r.isSome)
      expect(r.value).to.equal('default')
    })
  })

  describe('#do()', function () {
    let somes = 0
    let nones = 0
    const caseSome = {
      some: x => (somes += 1)
    }
    const caseNone = {
      none: () => (nones += 1)
    }
    beforeEach('reset side effects', function () {
      somes = 0
      nones = 0
    })

    it('runs side effects for some', function () {
      expect(somes).to.equal(0)
      expect(nones).to.equal(0)
      some('thing').do(caseSome)
      expect(somes).to.equal(1)
      expect(nones).to.equal(0)
    })

    it('defaults to no side effects for some', function () {
      expect(somes).to.equal(0)
      expect(nones).to.equal(0)
      some('thing').do(caseNone)
      expect(somes).to.equal(0)
      expect(nones).to.equal(0)
    })

    it('runs side effects for none', function () {
      expect(somes).to.equal(0)
      expect(nones).to.equal(0)
      none().do(caseNone)
      expect(somes).to.equal(0)
      expect(nones).to.equal(1)
    })

    it('defaults to no side effects for none', function () {
      expect(somes).to.equal(0)
      expect(nones).to.equal(0)
      none().do(caseSome)
      expect(somes).to.equal(0)
      expect(nones).to.equal(0)
    })
  })

  describe('Maybe in the real world', function () {
    // Maybe real world example
    type User = {
      name: string;
      getAvatar: () => Maybe<Avatar>;
    }

    type Avatar = {
      type: string;
      getURL: () => Maybe<string>;
    }
    function getUser (urlResponse): Maybe<User> {
      return some({
        name: 'The User',
        getAvatar: (): Maybe<Avatar> =>
          some({
            type: 'url',
            getURL: (): Maybe<string> => urlResponse
            // getURL: () => none('No avatar found')
          })
      })
    }

    it('returns some url', function () {
      let url = getUser(some('A URL'))
        .bind(user => user.getAvatar())
        .bind(avatar => avatar.getURL())
        .defaulting('defaultUrl')
        .map(u => u.toLowerCase())
        .bind(url => some(`URL is ${url}`))

      mlog.log(url)
      expect(url.isSome)
      expect(url.value).to.eql('URL is a url')
    })

    it('fails on none url', function () {
      let url = getUser(none('error'))
        .bind(user => user.getAvatar())
        .bind(avatar => avatar.getURL())
        .bind(url => some(`URL is ${url}`))

      mlog.log(url)
      expect(url.isNone)
    })

    it('can default on none url', function () {
      let url = getUser(none('error'))
        .bind(user => user.getAvatar())
        .bind(avatar => avatar.getURL())
        .bind(url => (expect(false), some(`URL is ${url}`)))
        .defaulting('defaultUrl')

      mlog.log(url)
      expect(url.isSome)
      expect(url.value).to.eql('defaultUrl')
    })
  })
})
