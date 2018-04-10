import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {withHooks} from 'vue-compose';

const Component = {
  template: '<div></div>'
};
mount(Component);

test('adds a created hook', t => {
  const spy = sinon.spy();
  const enhanced = withHooks({
    created: spy
  })(Component);
  mount(enhanced);

  t.truthy(enhanced.created);
  t.true(spy.called);
});

test('ignores non-hooks', t => {
  const enhanced = withHooks({
    foo : 'bah',
  })(Component);
  t.is(enhanced.foo, undefined);
});
