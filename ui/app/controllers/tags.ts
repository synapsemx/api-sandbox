import Tag from 'ui/models/tag';
import ResourceController from './resource';

export default class TagsController extends ResourceController<Tag> {
  modelType = 'tag' as const;
}
