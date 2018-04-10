import test from 'ava';
import {mount} from 'vuenit';
import {withProps} from 'vue-compose';

const Component = {
  props: ['propA', 'propB', 'propC'],
  template: `<div>
    <span id="a">{{propA}}</span>
    <span id="b">{{propB}}</span>
    <span id="c">{{propC}}</span>
  </div>`
};
mount(Component);

test('maps props to new values (object)', t => {
  const enhance = withProps({
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

  t.is(a, 'enhancedPropA');
  t.is(b, 'B');
  t.is(c, 'enhancedPropC');
});

test('maps props to new values (function)', t => {
  const enhance = withProps(props => ({
    propA: 'enhancedPropA',
    propB: props.propB,
    propC: 'enhancedPropC'
  }));
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

  t.is(a, 'enhancedPropA');
  t.is(b, 'B');
  t.is(c, 'enhancedPropC');
});

test('maps props even if undefined', t => {
  const enhance = withProps(props => ({
    propA: 'enhancedPropA',
    propB: props.propB,
    propC: 'enhancedPropC'
  }));
  const enhanced = enhance(Component);
  const vm = mount(enhanced);

  const a = vm.$findOne('#a').$text;
  const b = vm.$findOne('#b').$text;
  const c = vm.$findOne('#c').$text;

  t.is(a, 'enhancedPropA');
  t.is(b, '');
  t.is(c, 'enhancedPropC');
});

test('preserves unampped props (function)', t => {
  const enhance = withProps(() => ({
    propA: 'enhancedPropA',
  }));
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

  t.is(a, 'enhancedPropA');
  t.is(b, 'B');
  t.is(c, 'C');
});

test('preserves unampped props (object)', t => {
  const enhance = withProps({
    propA: 'enhancedPropA'
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

  t.is(a, 'enhancedPropA');
  t.is(b, 'B');
  t.is(c, 'C');
});

test('prop changes are still mapped', async t => {
  const enhance = withProps(props => ({
    propA: props.propA + '!',
    propB: props.propB,
    propC: props.propC + '?'
  }));
  const enhanced = enhance(Component);
  const vm = mount(enhanced, {
    props: {
      propA: 'A',
      propB: 'B',
      propC: 'C'
    }
  });

  let a = vm.$findOne('#a').$text;
  let b = vm.$findOne('#b').$text;
  let c = vm.$findOne('#c').$text;

  t.is(a, 'A!');
  t.is(b, 'B');
  t.is(c, 'C?');

  vm.propsData.propA = 'a';
  vm.propsData.propB = 'b';
  vm.propsData.propC = 'c';
  await vm.$nextTick();

  a = vm.$findOne('#a').$text;
  b = vm.$findOne('#b').$text;
  c = vm.$findOne('#c').$text;

  t.is(a, 'a!');
  t.is(b, 'b');
  t.is(c, 'c?');
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
      propC: {
        required: true,
      },
    },
  });

  const A = withProps({
    propA: () => 'A',
    propB: () => undefined,
  })(C);

  t.is(A.props.propA.required, false);
  t.is(A.props.propB.required, false);
  t.is(A.props.propC.required, true);
});
