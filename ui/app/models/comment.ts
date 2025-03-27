import Model, { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type Post from './post';

export default class Comment extends Model {
  declare [Type]: 'comment';

  @belongsTo<Post>('post', { async: true, inverse: 'comments' })
  declare post: AsyncBelongsTo<Post>;

  @attr('string') declare content: string;
}
