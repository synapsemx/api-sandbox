import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type {
  AdaptableAsyncBelongsTo,
  AdaptableAsyncHasMany,
} from 'ui/utils/type-utils';
import Category from './category';
import type Comment from './comment';
import type Tag from './tag';

export default class Post extends Model {
  declare [Type]: 'post';

  @belongsTo<Category>('category', { async: true, inverse: 'posts' })
  declare category: AdaptableAsyncBelongsTo<Category>;

  @belongsTo<Post>('post', { async: true, inverse: 'parent' })
  declare parent: AdaptableAsyncBelongsTo<Post>;

  @hasMany<Tag>('tag', { async: true, inverse: null })
  declare tags: AdaptableAsyncHasMany<Tag>;

  @hasMany<Comment>('comment', { async: true, inverse: 'post' })
  declare comments: AdaptableAsyncHasMany<Comment>;

  @attr('string') declare content: string;
}
