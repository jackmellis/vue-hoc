import test from 'ava';
import sinon from 'sinon';
import { mount } from 'vuenit';
import { withNativeHandlers } from 'vue-compose';
const Component = {
  name: 'BaseComponent',
  template: '<button>Click me</button>'
};
mount(Component);

test('adds handlers to the component', t => {
  const spy = sinon.spy();
  const enhance = withNativeHandlers({
    click: spy,
  });
  const enhanced = enhance(Component);
  const vm = mount(enhanced);

  vm.$find('button').$trigger('click');

  t.true(spy.called);
});
