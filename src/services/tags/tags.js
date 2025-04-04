// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import { TagsService, getOptions } from './tags.class.js'
import {
  relationships,
  tagsDataResolver,
  tagsDataValidator,
  tagsExternalResolver,
  tagsPatchResolver,
  tagsPatchValidator,
  tagsQueryResolver,
  tagsQueryValidator,
  tagsResolver
} from './tags.schema.js'
import { tagsMethods, tagsPath, tagsTable } from './tags.shared.js'

export * from './tags.class.js'
export * from './tags.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const tags = (app) => {
  // Register our service on the Feathers application
  app.use(
    tagsPath,
    new TagsService(getOptions(app, relationships, tagsTable)),
    {
      // A list of all methods this service exposes externally
      methods: tagsMethods,
      // You can add additional custom events to be sent to clients here
      events: []
    }
  )
  // Initialize hooks
  app.service(tagsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(tagsExternalResolver),
        schemaHooks.resolveResult(tagsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(tagsQueryValidator),
        schemaHooks.resolveQuery(tagsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(tagsDataValidator),
        schemaHooks.resolveData(tagsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(tagsPatchValidator),
        schemaHooks.resolveData(tagsPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
