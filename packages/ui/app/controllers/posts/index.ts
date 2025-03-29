import type Post from 'ui/models/post';
import ResourceController from '../resource';

export default class PostsIndexController extends ResourceController<Post> {
  modelType = 'post' as const;

  relationshipToInclude = ['category', 'tags'];
}
