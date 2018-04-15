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

test('it can render another component', t => {
  const Foo = {
    template: '<input id="foo" type="text">'
  };
  mount(Foo);
  const Bah = compose(
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
  )(componentFromSlot());

  const wrapper = {
    components: {Foo, Bah},
    template: '<Bah><Foo/></Bah>'
  };

  const vm = mount(wrapper);

  const actual = vm.$html;
  const expected = '<input id="foo" type="text" width="50" class="myClass" style="height: 400px; width: 50%;">';

  t.is(actual, expected);
});

test('it passes props to the inner componet', t => {
  const Foo = {
    template: '<div id="foo">{{value}}</div>',
    props: ['value'],
  };
  mount(Foo);
  const Bah = componentFromSlot();

  const Wrapper = {
    components: {Foo, Bah},
    template: '<Bah value="some value"><Foo/></Bah>',
  };

  const vm = mount(Wrapper);

  const actual = vm.$html;
  const expected = '<div id="foo" value="some value">some value</div>';

  t.is(actual, expected);
});
