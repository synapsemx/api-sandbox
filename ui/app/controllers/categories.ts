import type Store from '@ember-data/store';
import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import Category from 'ui/models/category';

export default class CategoriesController extends Controller {
  @service declare store: Store;

  @tracked categories: Category[] = [];

  @tracked
  newCategory: Category | null = null;

  findCategories = task({ drop: true }, async () => {
    const categories = await this.store.findAll<Category>('category');

    this.categories = [...categories];

    this.initializeCategory();
  });

  createCategory = task({ drop: true }, async () => {
    if (!this.newCategory) {
      return;
    }

    await this.newCategory.save();

    this.findCategories.perform();
  });

  initializeCategory() {
    this.newCategory = this.store.createRecord<Category>('category', {});
  }
}
