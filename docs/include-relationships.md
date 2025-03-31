# Include Relationships Hook

To support eager loading of related resources in Feathers, we implemented a custom `include-relationships` mechanism inspired by [Laravel's Eloquent relationship loading](https://laravel.com/docs/11.x/eloquent-relationships#defining-relationships). This allows clients to request related data in a single query using a custom `$include` operator.

## Overview

Our implementation is split into two parts:

### 1. Preprocessing the `$include` query (before hook)

**File:** [`src/hooks/process-include.js`](https://github.com/synapsemx/api-sandbox/blob/main/src/hooks/process-include.js)

This hook inspects incoming requests for a `$include` parameter in the query. If present, it validates the relationships requested and appends them to `context.params.include` so they can be processed later during the response phase.

This step ensures the logic is decoupled from the actual data resolution and allows the include logic to run independently of how the service itself queries data.

### 2. Resolving relationships after the service method (after hook)

**File:** [`src/hooks/include-relationships/index.js`](https://github.com/synapsemx/api-sandbox/blob/main/src/hooks/include-relationships/index.js)

This hook is responsible for loading the requested related resources and attaching them to the response. It supports multiple types of relationships:

- `belongsTo`
- `hasMany`
- `manyToMany`
- `morphTo`
- `morphToMany`

Each type is handled by its own dedicated handler, allowing for modular and extensible logic.

---

## Response Format

Instead of embedding related records directly inside the primary resource (as is common in JSON APIs), we return related data in a separate root-level `relations` key.

**Standard eager loading (not used):**

```json
{
  "posts": [
    {
      "id": 1,
      "category": {
        "id": 1,
        "name": "Lifestyle"
      }
    }
  ]
}
```

**Our format (Ember-compatible):**

```json
{
  "posts": [
    {
      "id": 1,
      "category": 1
    }
  ],
  "relations": {
    "categories": [
      {
        "id": 1,
        "name": "Lifestyle"
      }
    ]
  }
}
```

This structure is tailored to how **Ember Data** expects normalized responses: relationships are represented by IDs within the primary resource, and the full related records are included alongside in a compound document. This allows Ember to load and cache related data correctly without additional requests.

---

## Limitations

There are still a few open limitations in our current implementation:

- **Nested includes are not supported.** For example, including a parent post’s category in a single query (`post -> parent -> category`) is not currently possible.
- **Transaction context inheritance is not implemented.** When performing nested operations, we haven't yet found a clean way to preserve and propagate Feathers' transaction context across related service calls. This is something we need in our project and hope to address in the future.
