import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class Tag extends Model {
  declare [Type]: 'tag';

  @attr('string') declare name: string;
}
