import type Store from '@ember-data/store';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Post from 'ui/models/post';

export default class PostsRoute extends Route {
  @service declare store: Store;

  async model() {
    const posts = await this.store.query<Post>('post', {
      $include: ['category'],
    });

    return { posts };
  }
}
