import test from 'ava';
import {mount} from 'vuenit';
import {componentFromProp} from 'vue-compose';

test('creates a component from a prop', t => {
  const Button = componentFromProp('component');
  const vm = mount(Button, {
    props: {
      component: 'button',
    },
  });

  t.is(vm.$el.tagName, 'BUTTON');
});

test('can be passed another component', t => {
  const Button = componentFromProp('component');
  const MyComponent = {
    name: 'MyComponent',
    template: '<div>my component</div>',
  };
  mount(MyComponent);
  const vm = mount(Button, {
    props: {
      component: MyComponent,
    },
  });

  t.true(vm.$contains(MyComponent));
  t.is(vm.$html, '<div component="[object Object]">my component</div>');
});

test('allows additional props to be passed into the component', t => {
  const Button = componentFromProp('component');
  const Anchor = {
    name: 'Anchor',
    props: ['propA'],
    template: '<a>anchor</a>'
  };
  mount(Anchor);
  const vm = mount(Button, {
    props: {
      component: Anchor,
      href: '/some/url',
      propA: 'foo',
    },
  });

  t.true(vm.$contains(Anchor));
  const child = vm.$findOne(Anchor);
  t.is(child.propA, 'foo');
  t.is(child.$html, '<a component="[object Object]" href="/some/url" propa="foo">anchor</a>');
});
