import axios from 'axios'
import { app } from '../../src/app'

let server

export const appUrl = `http://${app.get('host')}:${app.get('port')}`

export const instantiateHttp = () => axios.create({ baseURL: appUrl })

export const setupServer = () => {
  beforeAll(async () => {
    server = await app.listen(app.get('port'))
  })

  afterAll(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(new Error(error)) : resolve()))
    })
  })
}
