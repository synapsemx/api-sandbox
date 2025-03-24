import { KnexService as Base } from '@feathersjs/knex'
import KnexAdapter from './adapter.js'

/**
 * @type {Base}
 */
class KnexService extends KnexAdapter {}

Object.getOwnPropertyNames(Base.prototype).forEach((key) => {
  if (key !== 'constructor') {
    KnexService.prototype[key] = Base.prototype[key]
  }
})

export default KnexService
