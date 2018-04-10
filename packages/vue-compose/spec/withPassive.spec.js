import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {withPassive} from 'vue-compose';
const Component = {
  name: 'BaseComponent',
  template: '<div></div>'
};
mount(Component);

test('adds handlers to the component', t => {
  const spy = sinon.spy();
  const enhance = withPassive({
    customEvent: spy,
  });
  const enhanced = enhance(Component);
  const vm = mount(enhanced);

  vm.$find('BaseComponent').$emit('customEvent');

  t.true(spy.called);
});

test('does not prevent events bubbling up', t => {
  const spy = sinon.spy();
  const enhanced = withPassive({
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

  t.true(spy.called);
});

test('handlers can call other handlers', t => {
  const spy = sinon.spy();

  const enhanced = withPassive({
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
