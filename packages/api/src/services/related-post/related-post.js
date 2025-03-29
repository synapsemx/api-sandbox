// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import { RelatedPostService, getOptions } from './related-post.class.js'
import {
  relatedPostDataResolver,
  relatedPostDataValidator,
  relatedPostExternalResolver,
  relatedPostPatchResolver,
  relatedPostPatchValidator,
  relatedPostQueryResolver,
  relatedPostQueryValidator,
  relatedPostResolver
} from './related-post.schema.js'
import {
  relatedPostMethods,
  relatedPostPath,
  relatedPostTable
} from './related-post.shared.js'

export * from './related-post.class.js'
export * from './related-post.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const relatedPost = (app) => {
  // Register our service on the Feathers application
  app.use(
    relatedPostPath,
    new RelatedPostService(getOptions(app, {}, relatedPostTable)),
    {
      // A list of all methods this service exposes externally
      methods: relatedPostMethods,
      // You can add additional custom events to be sent to clients here
      events: []
    }
  )
  // Initialize hooks
  app.service(relatedPostPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(relatedPostExternalResolver),
        schemaHooks.resolveResult(relatedPostResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(relatedPostQueryValidator),
        schemaHooks.resolveQuery(relatedPostQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(relatedPostDataValidator),
        schemaHooks.resolveData(relatedPostDataResolver)
      ],
      patch: [
        schemaHooks.validateData(relatedPostPatchValidator),
        schemaHooks.resolveData(relatedPostPatchResolver)
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
