import type Store from '@ember-data/store';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type { TypeFromInstance } from '@warp-drive/core-types/record';
import { task } from 'ember-concurrency';
import type Category from 'ui/models/category';
import type Tag from 'ui/models/tag';
import type Router from 'ui/router';
import type PostsNewRoute from 'ui/routes/posts/new';
import type { ModelFrom } from 'ui/utils/type-utils';

export default class PostsNewController extends Controller {
  @service declare store: Store;
  @service declare router: Router;

  declare model: ModelFrom<PostsNewRoute>;

  get categoryOptions() {
    return this.store.peekAll<Category>('category').map((category) => ({
      value: category.id,
      label: category.name,
    }));
  }

  get tagOptions() {
    return this.store.peekAll<Tag>('tag').map((tag) => ({
      value: tag.id,
      label: tag.name,
    }));
  }

  get selectedCategory() {
    return [this.model.belongsTo('category').id()].filter(Boolean);
  }

  get selectedTags() {
    return this.model.hasMany('tags' as never).ids();
  }

  findResource<T>(modelType: TypeFromInstance<T>, modelId: string): T {
    const model = this.store.peekRecord<T>(modelType, modelId);

    if (!model) {
      throw new Error(`Could not find ${modelType} with id ${modelId}`);
    }

    return model;
  }

  isHTMLSelect(EventTarget: EventTarget | null) {
    return EventTarget instanceof HTMLSelectElement;
  }

  @action
  handleCategoryChange(event: Event) {
    if (!this.isHTMLSelect(event.target)) {
      return;
    }

    const category = this.findResource<Category>(
      'category',
      event.target.value,
    );

    this.model.category = category;
  }

  @action
  handleTagsChange(event: Event) {
    if (!this.isHTMLSelect(event.target)) {
      return;
    }

    const tagIds = [...event.target.selectedOptions]
      .map((option) => option.value)
      .filter(Boolean);

    const tags = tagIds.map((id) => this.findResource<Tag>('tag', id));

    this.model.tags = tags;
  }

  createPost = task({ drop: true }, async () => {
    await this.model.save();

    this.router.transitionTo('posts');
  });
}
