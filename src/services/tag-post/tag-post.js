// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  tagPostDataValidator,
  tagPostPatchValidator,
  tagPostQueryValidator,
  tagPostResolver,
  tagPostExternalResolver,
  tagPostDataResolver,
  tagPostPatchResolver,
  tagPostQueryResolver
} from './tag-post.schema.js'
import { TagPostService, getOptions } from './tag-post.class.js'

export const tagPostPath = 'tag-post'
export const tagPostMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './tag-post.class.js'
export * from './tag-post.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const tagPost = app => {
  // Register our service on the Feathers application
  app.use(tagPostPath, new TagPostService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: tagPostMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(tagPostPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(tagPostExternalResolver),
        schemaHooks.resolveResult(tagPostResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(tagPostQueryValidator), schemaHooks.resolveQuery(tagPostQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(tagPostDataValidator), schemaHooks.resolveData(tagPostDataResolver)],
      patch: [schemaHooks.validateData(tagPostPatchValidator), schemaHooks.resolveData(tagPostPatchResolver)],
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
