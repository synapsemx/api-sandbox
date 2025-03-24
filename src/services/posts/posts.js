// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  postsDataValidator,
  postsPatchValidator,
  postsQueryValidator,
  postsResolver,
  postsExternalResolver,
  postsDataResolver,
  postsPatchResolver,
  postsQueryResolver
} from './posts.schema.js'
import { PostsService, getOptions } from './posts.class.js'

export const postsPath = 'posts'
export const postsMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './posts.class.js'
export * from './posts.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const posts = app => {
  // Register our service on the Feathers application
  app.use(postsPath, new PostsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: postsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(postsPath).hooks({
    around: {
      all: [schemaHooks.resolveExternal(postsExternalResolver), schemaHooks.resolveResult(postsResolver)]
    },
    before: {
      all: [schemaHooks.validateQuery(postsQueryValidator), schemaHooks.resolveQuery(postsQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(postsDataValidator), schemaHooks.resolveData(postsDataResolver)],
      patch: [schemaHooks.validateData(postsPatchValidator), schemaHooks.resolveData(postsPatchResolver)],
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
