import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {withData} from 'vue-compose';

const C = {
  name: 'BaseComponent',
  props: ['test', 'vest'],
  template: '<div></div>',
  methods: {
    updateTest(){
      this.$emit('test', 'bah');
    },
    updateVest(){
      this.$emit('updateVest', 'baz');
    },
  },
};
mount(C);

test('creates a hoc with a data property', t => {
  const enhanced = withData({
    test: {
      initialValue: 'foo',
    }
  })(C);
  const vm = mount(enhanced);

  t.is(vm.test, 'foo');
});
test('passes the data property to the original component', t => {
  const enhanced = withData({
    test: {
      initialValue: 'foo'
    }
  })(C);
  const vm = mount(enhanced);
  const child = vm.$findOne(C);

  t.is(child.test, 'foo');
});
test('passes the data property under another prop name', t => {
  const enhanced = withData({
    test: {
      initialValue: 'foo',
      prop: 'vest',
    }
  })(C);
  const vm = mount(enhanced);
  const child = vm.$findOne(C);

  t.is(child.test, undefined);
  t.is(child.vest, 'foo');
});
test('sets an initial value with a function', t => {
  const enhanced = withData({
    test: {
      initialValue: () => 'foo',
    }
  })(C);
  const vm = mount(enhanced);
  const child = vm.$findOne(C);

  t.is(child.test, 'foo');
});
test('adds a listener to the component', t => {
  const enhanced = withData({
    test: {
      initialValue: 'foo',
    }
  })(C);
  const vm = mount(enhanced);
  const child = vm.$findOne(C);

  child.updateTest();

  t.is(vm.test, 'bah');
});
test('adds a custom listener name to the component', t => {
  const enhanced = withData({
    test: {
      initialValue: 'foo',
      listener: 'updateVest',
    }
  })(C);
  const vm = mount(enhanced);
  const child = vm.$findOne(C);

  child.updateVest();

  t.is(vm.test, 'baz');
});
test('calls a custom handler when the listener is emitted', t => {
  let spy = sinon.stub().callsFake(function(v){
    this.test = v.split('').reverse().join('');
  });
  const enhanced = withData({
    test: {
      initialValue: 'foo',
      handler: spy,
    }
  })(C);
  const vm = mount(enhanced);
  const child = vm.$findOne(C);

  child.updateTest();

  t.true(spy.called);
  t.is(vm.test, 'hab');
});
