// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  commentsDataValidator,
  commentsPatchValidator,
  commentsQueryValidator,
  commentsResolver,
  commentsExternalResolver,
  commentsDataResolver,
  commentsPatchResolver,
  commentsQueryResolver
} from './comments.schema.js'
import { CommentsService, getOptions } from './comments.class.js'

export const commentsPath = 'comments'
export const commentsMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './comments.class.js'
export * from './comments.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const comments = app => {
  // Register our service on the Feathers application
  app.use(commentsPath, new CommentsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: commentsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(commentsPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(commentsExternalResolver),
        schemaHooks.resolveResult(commentsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(commentsQueryValidator),
        schemaHooks.resolveQuery(commentsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(commentsDataValidator),
        schemaHooks.resolveData(commentsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(commentsPatchValidator),
        schemaHooks.resolveData(commentsPatchResolver)
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
