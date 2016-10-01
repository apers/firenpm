/* eslint-env mocha */
import * as api from '../lib'
import { expect } from '../../firenpm/mochaccino'

describe('api', () => {
  describe('.parseArgs()', () => {
    it('should parse package name', () => {
      expect(api.parseArgs([1, 2, 'abc'])).toEqual({packageName: 'abc', extensions: []})
    })

    it('should parse package extensions', () => {
      expect(api.parseArgs([1, 2, 'abc', '--web', 'a', '--ccc'])).toEqual({packageName: 'abc', extensions: ['web', 'ccc']})
    })

    it('should throw an error when package name not given', () => {
      expect(() => {
        api.parseArgs([])
      }).toThrow()
    })
  })
})
