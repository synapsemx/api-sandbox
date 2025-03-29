import Model, { attr, hasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type { AdaptableAsyncHasMany } from 'ui/utils/type-utils';
import type Post from './post';

export default class Category extends Model {
  declare [Type]: 'category';

  @hasMany<Post>('post', { async: true, inverse: 'category' })
  declare posts: AdaptableAsyncHasMany<Post>;

  @attr('string') declare name: string;
}
