import test from 'ava';
import sinon from 'sinon';
import { mount, mockStore } from 'vuenit';
import { createSink } from 'vue-compose';

import {
  mapMutationsToHandlers,
} from 'vuex-compose';

test('maps mutations to handlers', t => {
  const spy = sinon.spy();
  const store = mockStore({
    mutations: {
      FOO: spy,
    },
  });
  const C = createSink(function () {
    this.$emit('submit', 'xxx');
  });
  const Wrapper = mapMutationsToHandlers({
    submit: 'FOO',
  })(C);

  mount(Wrapper, {
    install: (Vue) => Vue.prototype.$store = store,
  });

  t.true(spy.called);
  t.is(spy.lastCall.args[1], 'xxx');
});
