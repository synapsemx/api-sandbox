# Custom Relationship Query Support in the Knex Adapter

While Feathers’ Knex adapter already provides a solid foundation for implementing common service methods (`find`, `get`, `create`, `patch`, `remove`, etc.), we needed to extend it to support more expressive relationship queries in our application.

To achieve this, we created a custom adapter ([`src/lib/knex/adapter.js`](https://github.com/synapsemx/api-sandbox/blob/main/src/lib/knex/adapter.js)) that adds two query operators:

- `$joinRelation`: to perform joins across declared relationships.
- `$whereRelation`: to filter records based on related resources (similar to Laravel's `whereHas` clause).

These were introduced to better support how Ember Data expects related data to be queried and filtered.

## Declaring Relationships

To make this work, each service defines its relationships up front using a `RelationshipsMap`. These definitions include the type of relationship, the related service, and any foreign keys or pivot tables required.

**Example:** [`src/services/posts/posts.schema.js`](https://github.com/synapsemx/api-sandbox/blob/main/src/services/posts/posts.schema.js)

```js
/**
 * @type {import('@types/relationships').RelationshipsMap}
 */
export const relationships = {
  category: {
    type: relationshipTypes.belongsTo,
    service: categoriesPath,
    foreignKey: 'category_id'
  },
  tags: {
    type: relationshipTypes.manyToMany,
    service: tagsPath,
    pivotService: tagPostPath,
    primaryKey: 'post_id',
    relatedKey: 'tag_id'
  },
  comments: {
    type: relationshipTypes.morphMany,
    service: commentsPath,
    morphKey: 'morph_id',
    morphType: 'morph_type'
  },
  related_posts: {
    type: relationshipTypes.manyToMany,
    service: postsPath,
    primaryKey: 'post_id',
    relatedKey: 'related_post_id',
    pivotService: relatedPostPath
  },
  parent: {
    type: relationshipTypes.belongsTo,
    service: postsPath,
    foreignKey: 'parent_id'
  }
}
```

These are passed into the service's options:

```js
export const getOptions = (app, relationships, tableName) => {
  return {
    app,
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: tableName,
    relationships
  }
}
```

---

## `$joinRelation`: Joining Related Resources

This operator enables SQL joins using relationship definitions, allowing for more complex filtering and data shaping.

**Example: Get all categories that have a post with a specific ID**

```js
const categories = await app.service('categories').find({
  query: {
    $joinRelation: ['posts'],
    'posts.id': post.id
  }
})
```

> Implementation: [`src/lib/knex/join-relation.support.js`](https://github.com/synapsemx/api-sandbox/blob/main/src/lib/knex/join-relation.support.js)  
> Test: [`test/lib/knex/join-relation.support.test.js`](https://github.com/synapsemx/api-sandbox/blob/main/test/lib/knex/join-relation.support.test.js)

---

### `$whereRelation`: Filtering by Related Records

This operator allows filtering based on the existence or attributes of related resources. Inspired by Laravel’s [`whereHas`](https://laravel.com/docs/11.x/eloquent-relationships#inline-relationship-existence-queries).

**Example: Get all posts that have at least one tag named "Gamma" or "Delta"**

```js
const posts = await app.service('posts').find({
  query: {
    $whereRelation: {
      tags: {
        $or: [
          { 'tags.name': 'Gamma' },
          { 'tags.name': 'Delta' }
        ]
      }
    }
  }
})
```

> Implementation: [`src/lib/knex/where-relation.support.js`](https://github.com/synapsemx/api-sandbox/blob/main/src/lib/knex/where-relation.support.js)  
> Test: [`test/lib/knex/where-relation.support.test.js`](https://github.com/synapsemx/api-sandbox/blob/main/test/lib/knex/where-relation.support.test.js)
