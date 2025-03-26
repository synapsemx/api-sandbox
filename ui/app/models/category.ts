import Model, { attr, hasMany, type AsyncHasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type Post from './post';

export default class Category extends Model {
  declare [Type]: 'category';

  @hasMany<Post>('post', { async: true, inverse: 'category' })
  declare posts: AsyncHasMany<Post>;

  @attr('string') declare name: string;
}
