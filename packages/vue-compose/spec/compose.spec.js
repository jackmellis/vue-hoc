import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {
  compose,
  defaultProps,
  withProps,
  withHandlers,
  withData,
  withClass,
  withStyle,
} from 'vue-compose';

const C = {
  props: ['propA', 'propB', 'propC', 'propD'],
  name: 'BaseComponent',
  template: '<div></div>',
};
mount(C);

test('compose multiple hocs together', t => {
  const spy = sinon.spy();
  const enhance = compose(
    withClass(['classA']),
    defaultProps({
      propA: 'x',
      propB: 'y',
      propC: 'z',
    }),
    withProps({
      propA(){
        return 'I am prop a';
      }
    }),
    withProps((props) => {
      return {
        propB: props.propA + ' B',
      };
    }),
    withHandlers({
      someEvent: spy,
    }),
    withClass(['classB']),
    withStyle({
      width: '100%',
    }),
  );

  const enhanced = enhance(C);
  const wrapper = mount(enhanced, {
    props: {
      propD: 'from parent',
    },
  });
  const vm = wrapper.$findOne(C);
  vm.$emit('someEvent');

  t.is(vm.propA, 'I am prop a');
  t.is(vm.propB, 'I am prop a B');
  t.is(vm.propC, 'z');
  t.is(vm.propD, 'from parent');
  t.true(vm.$el.classList.contains('classA'));
  t.true(vm.$el.classList.contains('classB'));
  t.is(vm.$el.style.width, '100%');

  t.true(spy.called);
});
