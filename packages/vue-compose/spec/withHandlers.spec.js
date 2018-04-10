import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {withHandlers} from 'vue-compose';
const Component = {
  name: 'BaseComponent',
  template: '<div></div>'
};
mount(Component);

test('adds handlers to the component', t => {
  const spy = sinon.spy();
  const enhance = withHandlers({
    customEvent: spy,
  });
  const enhanced = enhance(Component);
  const vm = mount(enhanced);

  vm.$find('BaseComponent').$emit('customEvent');

  t.true(spy.called);
});

test('prevents handlers bubbling up', t => {
  const spy = sinon.spy();
  const enhanced = withHandlers({
    customEvent: () => {},
  })(Component);
  const vm = mount({
    template: '<enhanced @customEvent="triggerSpy"/>',
    methods: {
      triggerSpy: spy,
    },
    components: {enhanced},
  });

  vm.$find('BaseComponent').$emit('customEvent');

  t.false(spy.called);
});

test('can bubble events up', t => {
  const spy1 = sinon.spy();
  const spy2 = sinon.stub().callsFake(function () {
    this.$emit('customEvent');
  });
  const enhanced = withHandlers({
    customEvent: spy2,
  })(Component);
  const vm = mount({
    template: '<enhanced @customEvent="triggerSpy"/>',
    methods: {
      triggerSpy: spy1,
    },
    components: {enhanced},
  });

  vm.$find('BaseComponent').$emit('customEvent');

  t.true(spy1.called);
  t.true(spy2.called);
});

test('handlers can call other handlers', t => {
  const spy = sinon.spy();

  const enhanced = withHandlers({
    first: spy,
    second(){
      this.handleFirst();
    }
  })(Component);

  const vm = mount({
    template: '<enhanced/>',
    components: {enhanced},
  });

  vm.$find('BaseComponent').$emit('second');

  t.true(spy.called);
});
