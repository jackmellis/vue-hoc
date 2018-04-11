import test from 'ava';
import sinon from 'sinon';
import { mount, mockStore } from 'vuenit';
import { createSink } from 'vue-compose';
import vuex from 'vuex';
import Vue from 'vue';

import {
  mapActionsToProps,
  mapActionsToMethods,
  mapActionsToHandlers,
  mapActionCreatorsToProps,
  mapActionCreatorsToMethods,
  mapActionCreatorsToHandlers,
} from 'vuex-compose';

test('maps actions to handlers', t => {
  const ACTION = 'submit';
  const spy = sinon.spy();
  const store = mockStore({
    actions: {
      [ACTION]: spy,
    },
  });
  const C = createSink(function () {
    this.$emit('submit', 'xxx');
  });
  const Wrapper = mapActionsToHandlers({
    submit: ACTION,
  })(C);

  mount(Wrapper, {
    install: (Vue) => Vue.prototype.$store = store,
  });

  t.true(spy.called);
  t.is(spy.lastCall.args[1], 'xxx');
});

test('maps actions to methods', t => {
  const ACTION = 'submit';
  const spy = sinon.spy();
  const store = mockStore({
    actions: {
      [ACTION]: spy,
    },
  });
  const C = createSink(function () {
    this.submit('xxx');
  });
  const Wrapper = mapActionsToMethods({
    submit: ACTION,
  })(C);

  mount(Wrapper, {
    install: (Vue) => Vue.prototype.$store = store,
  });

  t.true(spy.called);
  t.is(spy.lastCall.args[1], 'xxx');
});

test('maps actions to props', t => {
  const ACTION = 'submit';
  const spy = sinon.spy();
  const store = mockStore({
    actions: {
      [ACTION]: spy,
    },
  });
  const C = createSink((props) => {
    props.onSubmit('xxx');
  });
  const Wrapper = mapActionsToProps({
    onSubmit: ACTION,
  })(C);

  mount(Wrapper, {
    install: (Vue) => Vue.prototype.$store = store,
  });

  t.true(spy.called);
  t.is(spy.lastCall.args[1], 'xxx');
});

test('maps action creators to handlers', t => {
  const ACTION = 'SUBMIT';
  const actionCreator = (foo) => ({
    type: ACTION,
    payload: {
      foo,
    },
  });
  const spy = sinon.spy();
  Vue.use(vuex);
  const store = new vuex.Store({
    actions: {
      [ACTION]: spy,
    },
  });
  const C = createSink(function() {
    this.$emit('submit', 'xxx');
  });
  const Wrapper = mapActionCreatorsToHandlers({
    submit: actionCreator,
  })(C);

  mount(Wrapper, {
    install: (Vue) => Vue.prototype.$store = store,
  });

  t.true(spy.called);
  t.is(spy.lastCall.args[1].payload.foo, 'xxx');
});

test('maps action creators to methods', t => {
  const ACTION = 'SUBMIT';
  const actionCreator = (foo) => ({
    type: ACTION,
    payload: {
      foo,
    },
  });
  const spy = sinon.spy();
  Vue.use(vuex);
  const store = new vuex.Store({
    actions: {
      [ACTION]: spy,
    },
  });
  const C = createSink(function() {
    this.submit('xxx');
  });
  const Wrapper = mapActionCreatorsToMethods({
    submit: actionCreator,
  })(C);

  mount(Wrapper, {
    install: (Vue) => Vue.prototype.$store = store,
  });

  t.true(spy.called);
  t.is(spy.lastCall.args[1].payload.foo, 'xxx');
});

test('maps action creators to props', t => {
  const ACTION = 'SUBMIT';
  const actionCreator = (foo) => ({
    type: ACTION,
    payload: {
      foo,
    },
  });
  const spy = sinon.spy();
  Vue.use(vuex);
  const store = new vuex.Store({
    actions: {
      [ACTION]: spy,
    },
  });
  const C = createSink(function(props) {
    props.onSubmit('xxx');
  });
  const Wrapper = mapActionCreatorsToProps({
    onSubmit: actionCreator,
  })(C);

  mount(Wrapper, {
    install: (Vue) => Vue.prototype.$store = store,
  });

  t.true(spy.called);
  t.is(spy.lastCall.args[1].payload.foo, 'xxx');
});
