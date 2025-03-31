# Feathers Eager Loading & Relationship Processing Demo

This is a focused demo showcasing how we solved two specific needs while using **Feathers.js** as a backend for an **Ember.js** application.

## Context

We're building an Ember app backed by Feathers. Ember Data has specific expectations for how relationships should be queried and persisted, which required us to implement some custom solutions.

## What This Demo Covers

### 1. Eager Loading for Relationships

We needed a way to preload related resources (similar to `with()` in Laravel’s Eloquent). This led to a custom implementation using a `$include` query operator that allows services to fetch related data efficiently. This was essential for matching how Ember expects relationships to be present in API responses.

To achieve this, we made two key additions:

- We extended the Knex adapter to support relationship-aware queries:  
  📄 [`docs/knex-adapter.md`](docs/knex-adapter.md)
- We created a custom hook called `include-relationships` to resolve and attach the related data:  
  📄 [`docs/include-relationships.md`](docs/include-relationships.md)

### 2. Relationship Processing on Create/Update

When creating or updating records, Ember sends relationship data using foreign key arrays (e.g., `tagIds`, `departmentIds`, etc.). To handle this, we built a `process-relationships` hook that automatically syncs those relationships on the backend.

> This approach is very specific to how Ember Data works and isn't meant as a general-purpose pattern. Most ORMs (like Laravel, Rails, Prisma) handle relationship persistence manually or differently. This hook was built to fill that gap in our stack.

## Getting Started

### Backend Setup

```bash
cp .env.example .env
docker compose up -d

nvm use
pnpm install
pnpm seed
pnpm start
```

### Run Backend Tests

```bash
pnpm test
```

### UI Setup

```bash
cd ui
cp .env.example .env
pnpm install
pnpm start
```

### Run UI Tests

```bash
pnpm test
```
