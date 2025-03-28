import type Category from 'ui/models/category';
import ResourceController from './resource';

export default class CategoriesController extends ResourceController<Category> {
  modelType = 'category' as const;
}
