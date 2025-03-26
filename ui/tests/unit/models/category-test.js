import { setupTest } from 'ui/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | category', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('category', {});
    assert.ok(model, 'model exists');
  });
});
