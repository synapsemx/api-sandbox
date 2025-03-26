import Model, {
  attr,
  belongsTo,
  type AsyncBelongsTo,
  hasMany,
  type AsyncHasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import Category from './category';
import type Tag from './tag';

export default class Post extends Model {
  declare [Type]: 'post';

  @belongsTo<Category>('category', { async: true, inverse: 'posts' })
  declare category: AsyncBelongsTo<Category>;

  @hasMany<Tag>('tag', { async: true, inverse: null })
  declare tags: AsyncHasMany<Tag>;

  @attr('string') declare content: string;
}
