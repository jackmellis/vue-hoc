import test from 'ava';
import sinon from 'sinon';
import { mount, mockStore } from 'vuenit';
import { createSink } from 'vue-compose';

import {
  mapGettersToProps,
  mapGettersToComputed,
} from 'vuex-compose';

test('maps getters to props', t => {
  const store = mockStore({
    state: {
      count: 2,
    },
    getters: {
      double: (state) => state.count * 2,
    },
  });
  const C = createSink((props) => {
    t.is(props.double, 4);
  });
  const Wrapper = mapGettersToProps([ 'double' ])(C);

  mount(Wrapper, {
    install: (Vue) => Vue.prototype.$store = store,
  });
});

test('maps getters to computed values', t => {
  const store = mockStore({
    state: {
      count: 2,
    },
    getters: {
      double: (state) => state.count * 2,
    },
  });
  const C = createSink(function(props){
    t.is(props.double, undefined);
    t.is(this.double, 4);
  });
  const Wrapper = mapGettersToComputed([ 'double' ])(C);

  mount(Wrapper, {
    install: (Vue) => Vue.prototype.$store = store,
  });
});

test('maps getters from a namespaced module', t => {
  const store = mockStore({
    foo: {
      bah: {
        state: {
          count: 2,
        },
        getters: {
          double: (state) => state.count * 2,
        },
      }
    }
  });
  const C = createSink((props) => {
    t.is(props.double, 4);
  });
  const Wrapper = mapGettersToProps('foo/bah', [ 'double' ])(C);

  mount(Wrapper, {
    install: (Vue) => Vue.prototype.$store = store,
  });
});
