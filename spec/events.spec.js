import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {createHOC, createRenderFn} from '../src';

const Component = {
  template : `<div>
                <button id="button1" @click="$emit('button1click')">1</button>
              </div>`,
  methods : {
    handleClick(){
      this.$emit('button1click');
    }
  }
};

test('it emits an event', t => {
  const spy = sinon.spy();
  const vm = mount(Component, {
    on : {
      button1click : spy
    }
  });

  vm.$find('#button1').$trigger('click');

  t.true(spy.called);
});

test('it emits an event through a hoc', t => {
  const spy = sinon.spy();
  const hoc = createHOC(null, Component);
  const C2 = {
    components : {hoc},
    template : `<hoc @button1click="callSpy"/>`,
    methods: {
      callSpy(){
        spy();
      }
    }
  };
  const vm = mount(C2);

  vm.$find('#button1').$trigger('click');

  t.true(spy.called);
});

test('it can intercept an event', t => {
  const spy1 = sinon.spy(), spy2 = sinon.spy();
  const hoc = createHOC({
    with: {
      listeners: {
        button1click: spy2,
      }
    }
  })(Component);
  const C2 = {
    components : {hoc},
    template : `<hoc @button1click="callSpy"/>`,
    methods: {
      callSpy(){
        spy1();
      }
    }
  };
  const vm = mount(C2);

  vm.$find('#button1').$trigger('click');

  t.false(spy1.called);
  t.true(spy2.called);
});

test('it can bubble an event', t => {
  const spy1 = sinon.spy(), spy2 = sinon.spy();
  const hoc = createHOC({
    render : createRenderFn({
      listeners(listeners){
        return {
          button1click : () => {
            spy2();
            this.$emit('button1click');
          }
        };
      }
    })
  })(Component);
  const C2 = {
    components : {hoc},
    template : `<hoc @button1click="callSpy"/>`,
    methods: {
      callSpy(){
        spy1();
      }
    }
  };
  const vm = mount(C2);

  vm.$find('#button1').$trigger('click');

  t.true(spy1.called);
  t.true(spy2.called);
});

test('events bubble through multiple hocs', t => {
  const spy = sinon.spy();
  const hoc1 = createHOC({}, Component);
  const hoc2 = createHOC({}, hoc1);
  const hoc3 = createHOC({}, hoc2);
  const C2 = {
    components : {hoc3},
    template : `<hoc3 @button1click="callSpy"/>`,
    methods: {
      callSpy(){
        spy();
      }
    }
  };
  const vm = mount(C2);

  vm.$find('#button1').$trigger('click');

  t.true(spy.called);
});
