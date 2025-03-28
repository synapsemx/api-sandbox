import type Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Category from 'ui/models/category';
import type Post from 'ui/models/post';
import type Tag from 'ui/models/tag';

export default class PostsNewRoute extends Route {
  @service declare store: Store;

  async model() {
    // Load dependencies
    this.store.findAll<Category>('category');
    this.store.findAll<Tag>('tag');

    return this.store.createRecord<Post>('post', {});
  }
}
