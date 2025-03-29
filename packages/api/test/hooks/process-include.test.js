import { beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../src/app'
import { instantiateHttp, setupServer } from '../helpers/http'

const DummyService = class {
  constructor(relationships) {
    this.options = {
      relationships
    }
  }

  find(params) {
    return params
  }
}

describe('process-include hook', () => {
  setupServer()

  beforeEach(() => {
    app.unuse('/dummy')
  })

  const assertIncludedRelationships = async (includeQueryParam) => {
    app.use('/dummy', new DummyService({ skills: {}, projects: {} }))

    const http = instantiateHttp()

    const response = await http.get(`/dummy?${includeQueryParam}`)
    const { includeRelationships } = response.data

    expect(Object.keys(includeRelationships)).toEqual(['skills', 'projects'])
  }

  it('should skip processing if $include param is not present', async () => {
    app.use('/dummy', new DummyService(null))

    const params = await app.service('dummy').find()

    expect(params.includeRelationships).toEqual({})
  })

  it('should return 400 if $include param contains an unknown relationship', async () => {
    app.use('/dummy', new DummyService({ skills: {} }))

    const http = instantiateHttp()

    try {
      await http.get('/dummy?$include=invalid')
      throw new Error('Expected error was not thrown')
    } catch (error) {
      expect(error.response.status).toEqual(400)
      expect(error.response.data.message).toEqual(
        'Invalid relationship to include: "invalid". Valid relationships are: skills.'
      )
    }
  })

  it('should support $include as comma-separated string', async () => {
    await assertIncludedRelationships('$include=skills,projects')
  })

  it('should support $include as array syntax', async () => {
    await assertIncludedRelationships('$include[]=skills&$include[]=projects')
  })
})
