import { faker } from '@faker-js/faker';
import { http, HttpResponse, type HttpHandler } from 'msw';
import config from 'ui/config/environment';

export const api = (path: string) => `${config.APP.API_HOST}/${path}`;

const createCategory = () => ({
  id: faker.string.uuid(),
  name: faker.commerce.department(),
});

const createTag = () => ({
  id: faker.string.uuid(),
  name: faker.hacker.noun(),
});

type Category = ReturnType<typeof createCategory>;
type Tag = ReturnType<typeof createTag>;

const createPost = (categories: Category[], tags: Tag[]) => {
  const category = faker.helpers.arrayElement(categories);
  const selectedTags = faker.helpers.arrayElements(
    tags,
    faker.number.int({ min: 0, max: 4 }),
  );

  return {
    id: faker.string.uuid(),
    category_id: category.id,
    parent_id: null,
    content: faker.lorem.paragraph(),
    category: category.id,
    tags: selectedTags.map((tag) => tag.id),
  };
};

const handleGetPosts = http.get(api('/posts'), () => {
  const categories = Array.from({ length: 4 }, createCategory);
  const tags = Array.from({ length: 9 }, createTag);
  const posts = Array.from({ length: 16 }, () => createPost(categories, tags));

  return HttpResponse.json({
    total: posts.length,
    limit: 50,
    skip: 0,
    data: posts,
    relations: {
      categories,
      tags,
    },
  });
});

const handlers: HttpHandler[] = [handleGetPosts];

export default handlers;
