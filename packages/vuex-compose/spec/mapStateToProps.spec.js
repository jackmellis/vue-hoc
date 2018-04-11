import test from 'ava';
import sinon from 'sinon';
import { mount, mockStore } from 'vuenit';
import { createSink } from 'vue-compose';

import { mapStateToProps } from 'vuex-compose';

test('it maps an array of keys to props', (t) => {
  const C = createSink((props) => {
    t.is(props.forename, 'John');
    t.is(props.surname, 'Doe');
  });
  const Wrapper = mapStateToProps(['forename', 'surname'])(C);
  const store = mockStore({
    state: {
      forename: 'John',
      surname: 'Doe',
    },
  });

  mount(Wrapper, {
    install: (Vue) => {
      Vue.prototype.$store = store;
    },
  });
});

test('it maps an object of key/values to props', (t) => {
  const C = createSink((props) => {
    t.is(props.firstName, 'John');
    t.is(props.lastName, 'Doe');
  });
  const Wrapper = mapStateToProps({
    firstName: 'forename',
    lastName: 'surname',
  })(C);
  const store = mockStore({
    state: {
      forename: 'John',
      surname: 'Doe',
    },
  });

  mount(Wrapper, {
    install: (Vue) => {
      Vue.prototype.$store = store;
    },
  });
});

test('it maps an object of key/functions to props', (t) => {
  const C = createSink((props) => {
    t.is(props.firstName, 'John');
    t.is(props.lastName, 'Doe');
  });
  const Wrapper = mapStateToProps({
    firstName: (state) => state.forename,
    lastName: (state) => state.surname,
  })(C);
  const store = mockStore({
    state: {
      forename: 'John',
      surname: 'Doe',
    },
  });

  mount(Wrapper, {
    install: (Vue) => {
      Vue.prototype.$store = store;
    },
  });
});

test('it throws if an invalid value provided', (t) => {
  const C = createSink(() => {});
  t.throws(() => mapStateToProps({
    firstName: 'forename',
    lastName: 9,
  })(C));
});

test('it maps a namespaced module to props', t => {
  const C = createSink((props) => {
    t.is(props.forename, 'John');
    t.is(props.surname, 'Doe');
  });
  const Wrapper = mapStateToProps('foo', [ 'forename', 'surname' ])(C);
  const store = mockStore({
    modules: {
      foo: {
        state: {
          forename: 'John',
          surname: 'Doe',
        },
      },
    },
  });

  mount(Wrapper, {
    install: (Vue) => {
      Vue.prototype.$store = store;
    },
  });
});
