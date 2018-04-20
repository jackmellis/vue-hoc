import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {createHOC, createHOCc, createRenderFn} from '../src';

const Component = {
  props : ['propA'],
  template : '<div>{{propA}}</div>',
};
mount(Component);

test('wraps a component in a hoc', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    props: {
      propA: 'foo'
    }
  });

  t.true(vm.$html.includes('foo'));
});

test('wraps a component in a curried hoc', t => {
  const hoc = createHOCc(null, null)(Component);
  const vm = mount(hoc, {
    props: {
      propA: 'foo'
    }
  });

  t.true(vm.$html.includes('foo'));
});

test('has a default name', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    props: {
      propA: 'foo'
    }
  });

  t.is(vm.$name, 'AnonymousHOC');
});

test('extends the compnent name', t => {
  const hoc = createHOC(Object.assign({name:'MyComponent'}, Component));
  const vm = mount(hoc, {
    name: 'MyComponent',
    props: {
      propA: 'foo'
    }
  });

  t.is(vm.$name, 'MyComponentHOC');
});

test('extends the compnent name', t => {
  const hoc = createHOC(Component, {
    name: 'MyHoc',
  });
  const vm = mount(hoc, {
    name: 'MyComponent',
    props: {
      propA: 'foo'
    }
  });

  t.is(vm.$name, 'MyHoc');
});

test('provide props to the hoc', t => {
  const hoc = createHOC(Component, null, {
    props: {
      propA: 'from hoc'
    }
  });
  const vm = mount(hoc, {
    props: {
      propA: 'foo'
    }
  });

  t.true(vm.$html.includes('from hoc'));
  t.false(vm.$html.includes('foo'));
});
