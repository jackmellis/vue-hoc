import test from 'ava';
import { mount, mockStore } from 'vuenit';
import Vue from 'vue';
import vuex from 'vuex';
import { createSink } from 'vue-compose';

import { registerModule } from 'vuex-compose';

Vue.use(vuex);

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

test('registers a deep module', (t) => {
  const store = new vuex.Store({});
  const C = createSink(() => {});
  const Wrapper = registerModule(
    'foo/bah/baz',
    {
      state: {
        foo: 'bah',
      },
    },
  )(C);

  mount(Wrapper, {
    install: (Vue) => Vue.prototype.$store = store,
  });

  t.is(store.state.foo.bah.baz.foo, 'bah');
});
