import test from 'ava';
import {mount} from 'vuenit';
import {withProps, withComputed, compose} from 'vue-compose';

const C = {
  name: 'BaseComponent',
  props: ['propA'],
  template: '<div></div>'
};
mount(C);

test('adds computed properties to an existing hoc', t => {
  const enhanced = compose(
    withComputed({
      compA(){
        return 'foo';
      },
      compB(){
        return this.compA;
      }
    }),
    withProps({
      propA(){
        return this.compB;
      }
    }),
  )(C);

  const vm = mount(enhanced);
  const child = vm.$findOne(C);

  t.is(child.propA, 'foo');
});
