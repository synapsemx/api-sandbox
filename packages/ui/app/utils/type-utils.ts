import type Model from '@ember-data/model';
import type { AsyncBelongsTo, AsyncHasMany } from '@ember-data/model';
import type Route from '@ember/routing/route';

export type ModelFrom<R extends Route> = Awaited<ReturnType<R['model']>>;

export type AdaptableAsyncHasMany<T extends Model> =
  | AsyncHasMany<T>
  | (T | null)[];

export type AdaptableAsyncBelongsTo<T extends Model> =
  | AsyncBelongsTo<T>
  | T
  | null;
