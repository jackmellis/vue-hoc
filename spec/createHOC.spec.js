import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {createHOC, createRenderFn} from '../src';

const Component = {
  props : ['propA'],
  template : `<div>{{propA}}</div>`,
};
mount(Component);

test('wraps a component in a hoc', t => {
  const hoc = createHOC(null, Component);
  const vm = mount(hoc, {
    props: {
      propA: 'foo'
    }
  });

  t.true(vm.$html.includes('foo'));
});

test('has a default name', t => {
  const hoc = createHOC(null, Component);
  const vm = mount(hoc, {
    props: {
      propA: 'foo'
    }
  });

  t.is(vm.$name, 'AnnonymousHOC');
});

test('extends the compnent name', t => {
  const hoc = createHOC(null, Object.assign({name:'MyComponent'}, Component));
  const vm = mount(hoc, {
    name: 'MyComponent',
    props: {
      propA: 'foo'
    }
  });

  t.is(vm.$name, 'MyComponentHOC');
});

test('extends the compnent name', t => {
  const hoc = createHOC({
    name: 'MyHoc',
  }, Component);
  const vm = mount(hoc, {
    name: 'MyComponent',
    props: {
      propA: 'foo'
    }
  });

  t.is(vm.$name, 'MyHoc');
});

test('provide props to the hoc', t => {
  const hoc = createHOC({
    with: {
      props: {
        propA: 'from hoc'
      }
    }
  }, Component);
  const vm = mount(hoc, {
    props: {
      propA: 'foo'
    }
  });

  t.true(vm.$html.includes('from hoc'));
  t.false(vm.$html.includes('foo'));
});
