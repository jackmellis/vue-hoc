import test from 'ava';
import {mount} from 'vuenit';
import {
  componentFromSlot,
  withStyle,
  withClass,
  withProps,
  acceptProps,
  compose
} from 'vue-compose';

test('renders the first slot of the component', t => {
  const C = componentFromSlot();
  const vm = mount(C, {
    innerHTML: '<div id="inner_div">Hello world</div>'
  });

  t.is(vm.$html, '<div id="inner_div">Hello world</div>');
});

test('it can pass additional properties to the slot', t => {
  const enhance = compose(
    withProps({
      width: 50,
    }),
    withStyle({
      height: '400px',
      width(){
        return `${this.width}%`;
      },
    }),
    withClass('myClass'),
    acceptProps(['width']),
  );
  const C = componentFromSlot();
  const enhanced = enhance(C);
  const vm = mount(enhanced, {
    innerHTML: '<div id="inner_id">Hello world</div>'
  });

  t.is(vm.$html, '<div id="inner_id" width="50" class="myClass" style="height: 400px; width: 50%;">Hello world</div>');
});

test.failing('it can render another component', t => {
  const Foo = {
    template: '<input id="foo" type="text">'
  };
  mount(Foo);
  const Bah = componentFromSlot();
  const enhance = compose(
    withProps({
      width: 50,
    }),
    withStyle({
      height: '400px',
      width(){
        return `${this.width}%`;
      },
    }),
    withClass('myClass'),
    acceptProps(['width']),
  );
  const enhanced = enhance(Bah);

  const wrapper = {
    components: {Foo, Bah: enhanced},
    template: '<Bah><Foo/></Bah>'
  };

  const vm = mount(wrapper);

  const actual = vm.$html;
  const expected = '<input id="foo" type="text" class="myClass" style="height: 400px; width: 50%;">';

  t.is(actual, expected);
});
