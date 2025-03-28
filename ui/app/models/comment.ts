import Model, { attr, belongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type { AdaptableAsyncBelongsTo } from 'ui/utils/type-utils';
import type Post from './post';

export default class Comment extends Model {
  declare [Type]: 'comment';

  @belongsTo<Post>('post', { async: true, inverse: 'comments' })
  declare post: AdaptableAsyncBelongsTo<Post>;

  @attr('string') declare content: string;
}
