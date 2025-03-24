// For more information about this file see https://dove.feathersjs.com/guides/cli/app.test.html
import { describe, expect, it } from 'vitest'
import { instantiateHttp, setupServer } from './helpers/http.js'

describe('Feathers application tests', () => {
  setupServer()

  it('starts and shows the index page', async () => {
    const http = instantiateHttp()
    const { data } = await http.get('/')

    expect(data).toBeTruthy(data.indexOf('<html lang="en">') !== -1)
  })

  it('shows a 404 JSON error', async () => {
    const http = instantiateHttp()

    try {
      await http.get(`/path/to/nowhere`, {
        responseType: 'json'
      })
    } catch (error) {
      const { response } = error

      expect(response?.status).toBe(404)
      expect(response?.data?.code).toBe(404)
      expect(response?.data?.name).toBe('NotFound')
    }
  })
})
