import test from 'ava';
import sinon from 'sinon';
import { mount, mockStore } from 'vuenit';
import { createSink } from 'vue-compose';

import { registerModule } from 'vuex-compose';

test('registers a module', (t) => {
  const store = mockStore();
  const C = createSink(() => {});
  const Wrapper = registerModule(
    'foobah',
    {
      state: {
        foo: 'bah',
      },
    },
  )(C);

  mount(Wrapper, {
    install: (Vue) => Vue.prototype.$store = store,
  });

  t.is(store.state.foobah.foo, 'bah');
});

test('does not overwrite an existing module', (t) => {
  const store = mockStore({
    modules: {
      foobah: {
        foo: 'foo',
      },
    },
  });
  const C = createSink(() => {});
  const Wrapper = registerModule(
    'foobah',
    {
      state: {
        foo: 'bah',
      },
    },
  )(C);

  mount(Wrapper, {
    install: (Vue) => Vue.prototype.$store = store,
  });

  t.is(store.state.foobah.foo, 'foo');
});
