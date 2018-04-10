import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {createHOC, createHOCc, createRenderFn} from '../src';

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
mount(Component);

test('it emits an event', t => {
  const spy = sinon.spy();
  const vm = mount(Component, {
    on : {
      button1click : spy
    }
  });
  vm.$findOne('#button1').$trigger('click');

  t.true(spy.called);
});

test('it emits an event through a hoc', t => {
  const spy = sinon.spy();
  const hoc = createHOC(Component);
  const C2 = {
    components : {hoc},
    template : '<hoc @button1click="callSpy"/>',
    methods: {
      callSpy(){
        spy();
      }
    }
  };
  const vm = mount(C2);

  vm.$findOne('#button1').$trigger('click');

  t.true(spy.called);
});

test('it can intercept an event', t => {
  const spy1 = sinon.spy(), spy2 = sinon.spy();
  const hoc = createHOCc(null, {
    listeners: {
      button1click: spy2,
    }
  })(Component);
  const C2 = {
    components : {hoc},
    template : '<hoc @button1click="callSpy"/>',
    methods: {
      callSpy(){
        spy1();
      }
    }
  };
  const vm = mount(C2);

  vm.$findOne('#button1').$trigger('click');

  t.false(spy1.called);
  t.true(spy2.called);
});

test('it can bubble an event (function syntax)', t => {
  const spy1 = sinon.spy(), spy2 = sinon.spy();
  const hoc = createHOC(Component, {
    render : createRenderFn(Component, {
      listeners(){
        return {
          button1click : () => {
            spy2();
            this.$emit('button1click');
          }
        };
      }
    })
  });
  const C2 = {
    components : {hoc},
    template : '<hoc @button1click="callSpy"/>',
    methods: {
      callSpy(){
        spy1();
      }
    }
  };
  const vm = mount(C2);
  t.log(vm.$html);
  vm.$findOne('#button1').$trigger('click');

  t.true(spy1.called);
  t.true(spy2.called);
});

test('it can bubble an event (object syntax)', t => {
  const spy1 = sinon.spy(), spy2 = sinon.spy();
  const hoc = createHOC(Component, {
    render : createRenderFn(Component, {
      listeners: {
        button1click(){
          spy2();
          this.$emit('button1click');
        }
      }
    })
  });
  const C2 = {
    components : {hoc},
    template : '<hoc @button1click="callSpy"/>',
    methods: {
      callSpy(){
        spy1();
      }
    }
  };
  const vm = mount(C2);

  vm.$findOne('#button1').$trigger('click');

  t.true(spy1.called);
  t.true(spy2.called);
});

test('events bubble through multiple hocs', t => {
  const spy = sinon.spy();
  const hoc1 = createHOCc({}, null)(Component);
  const hoc2 = createHOCc({}, null)(hoc1);
  const hoc3 = createHOCc({}, null)(hoc2);
  const C2 = {
    components : {hoc3},
    template : '<hoc3 @button1click="callSpy"/>',
    methods: {
      callSpy(){
        spy();
      }
    }
  };
  const vm = mount(C2);

  vm.$findOne('#button1').$trigger('click');

  t.true(spy.called);
});
