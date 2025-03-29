import Store from '@ember-data/store';
import { visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import Post from 'ui/models/post';
import type Tag from 'ui/models/tag';
import { setupTest } from '../helpers';
import { setupRequestMockingTest } from '../msw/test-support';

const SELECTORS = {
  title: 'h1',
  postItem: '[data-test-resource-type="post"]',
  postItemById: (id: string) => `[data-test-resource-id="${id}"]`,
  categoryRelationship: '[data-test-relationship-type="category"]',
  tagRelationship: '[data-test-relationship-type="tag"]',
  contentAttribute: '[data-test-attribute="content"]',
};

module('Acceptance | Posts index', function (hooks) {
  setupTest(hooks);
  setupRequestMockingTest(hooks);

  test('visting posts index', async function (assert) {
    await visit('/');

    const store = this.owner.lookup('service:store');

    if (!(store instanceof Store)) {
      throw new Error('Store must be an instance of Store.');
    }

    const posts = [...store.peekAll<Post>('post')];

    assert.dom(SELECTORS.title).hasText('Posts');
    assert.dom(SELECTORS.postItem).exists({ count: posts.length - 1 });

    for (const post of posts) {
      const category = post.belongsTo('category').value();
      let tags = post.hasMany('tags' as never).value();

      if (!(tags instanceof Array) || !category) {
        continue;
      }

      const postSelector = SELECTORS.postItemById(post.id as string);

      assert
        .dom(`${postSelector} ${SELECTORS.categoryRelationship}`)
        .hasText(`Category: ${category.name}`, 'category is rendered');
      assert
        .dom(`${postSelector} ${SELECTORS.contentAttribute}`)
        .hasText(post.content, 'content is rendered');

      const tagElements = document.querySelectorAll(
        `${postSelector} ${SELECTORS.tagRelationship}`,
      );
      const renderedTagNames = Array.from(tagElements).map(
        (el) => el.textContent?.trim() ?? '',
      );

      for (const tagName of tags.map((tag: Tag) => tag.name)) {
        assert.ok(
          renderedTagNames.includes(tagName),
          `tag "${tagName}" is rendered`,
        );
      }
    }
  });
});
