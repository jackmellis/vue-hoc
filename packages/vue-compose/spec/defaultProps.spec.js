import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {defaultProps, withProps, withHooks, compose} from 'vue-compose';

const Component = {
  props: ['propA', 'propB', 'propC'],
  template: `<div>
    <span id="a">{{propA}}</span>
    <span id="b">{{propB}}</span>
    <span id="c">{{propC}}</span>
  </div>`
};
mount(Component);

test('maps undefined props', t => {
  const enhance = defaultProps({
    propA: 'enhancedPropA',
    propC: 'enhancedPropC'
  });
  const enhanced = enhance(Component);
  const vm = mount(enhanced);

  const a = vm.$findOne('#a').$text;
  const b = vm.$findOne('#b').$text;
  const c = vm.$findOne('#c').$text;

  t.is(a, 'enhancedPropA');
  t.is(b, '');
  t.is(c, 'enhancedPropC');
});

test('does not overwrite props', t => {
  const enhance = defaultProps({
    propA: 'enhancedPropA',
    propC: 'enhancedPropC'
  });
  const enhanced = enhance(Component);
  const vm = mount(enhanced, {
    props: {
      propA: 'A',
      propB: 'B',
      propC: 'C'
    }
  });

  const a = vm.$findOne('#a').$text;
  const b = vm.$findOne('#b').$text;
  const c = vm.$findOne('#c').$text;

  t.is(a, 'A');
  t.is(b, 'B');
  t.is(c, 'C');
});

test('prop changes are still mapped', async t => {
  const enhance = defaultProps({
    propA: 'defaultA',
    propB: 'defaultB',
    propC: 'defaultC'
  });
  const enhanced = enhance(Component);
  const vm = mount(enhanced, {
    props: {
      propA: 'A',
      propB: 'B',
    }
  });

  let a = vm.$findOne('#a').$text;
  let b = vm.$findOne('#b').$text;
  let c = vm.$findOne('#c').$text;

  t.is(a, 'A');
  t.is(b, 'B');
  t.is(c, 'defaultC');

  vm.propsData.propA = undefined;
  vm.propsData.propB = undefined;
  vm.propsData.propC = 'c';
  await vm.$nextTick();

  a = vm.$findOne('#a').$text;
  b = vm.$findOne('#b').$text;
  c = vm.$findOne('#c').$text;

  t.is(a, 'defaultA');
  t.is(b, 'defaultB');
  t.is(c, 'c');
});

test('can be used in conjunction with defaultProps', t => {
  const A = withProps({
    propA: 'A'
  })(Component);
  const B = defaultProps({
    propA: 'defaultA',
    propB: 'defaultB',
    propC: 'defaultC'
  })(A);
  const vm = mount(B);

  let a = vm.$findOne('#a').$text;
  let b = vm.$findOne('#b').$text;
  let c = vm.$findOne('#c').$text;

  t.is(a, 'A');
  t.is(b, 'defaultB');
  t.is(c, 'defaultC');
});

test('overwrites required prop setting', t => {
  const C = Object.assign({}, Component, {
    props: {
      propA: {
        required: true,
      },
      propB: {
        required: true,
      },
      propC: {},
    },
  });

  const A = compose(
    withHooks({}),
    defaultProps({
      propA: 'A',
    }),
  )(C);

  t.is(A.props.propA.required, false);
  t.is(A.props.propB.required, true);
});
