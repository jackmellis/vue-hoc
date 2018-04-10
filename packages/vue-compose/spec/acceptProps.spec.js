import test from 'ava';
import {mount} from 'vuenit';
import {acceptProps, mapProps} from 'vue-compose';

const Component = {
  name: 'MyComponent',
  props: ['propA', 'propB', 'propC'],
  template: `<div>
    <span id="a">{{propA}}</span>
    <span id="b">{{propB}}</span>
    <span id="c">{{propC}}</span>
  </div>`
};
mount(Component);

test('adds additional props to the component (array)', t => {
  const A = acceptProps(['propD'])(Component);
  const B = mapProps(({propD}) => {
    return {
      propA: propD[0],
      propB: propD[1],
      propC: propD[2],
      propD: propD,
    };
  })(A);
  const vm = mount(B, {
    props: {
      propD: 'ABCDEFG'
    }
  });

  t.is(vm.$findOne('#a').$text, 'A');
  t.is(vm.$findOne('#b').$text, 'B');
  t.is(vm.$findOne('#c').$text, 'C');
});

test('adds additional props to the component (object)', t => {
  const A = acceptProps({
    propD: String
  })(Component);
  const B = mapProps(({propD}) => {
    return {
      propA: propD[0],
      propB: propD[1],
      propC: propD[2],
      propD: propD,
    };
  })(A);
  const vm = mount(B, {
    props: {
      propD: 'ABCDEFG'
    }
  });

  t.is(vm.$findOne('#a').$text, 'A');
  t.is(vm.$findOne('#b').$text, 'B');
  t.is(vm.$findOne('#c').$text, 'C');
});

test('adds additional props to the component (string)', t => {
  const A = acceptProps('propD')(Component);
  const B = mapProps(({propD}) => {
    return {
      propA: propD[0],
      propB: propD[1],
      propC: propD[2],
      propD: propD,
    };
  })(A);
  const vm = mount(B, {
    props: {
      propD: 'ABCDEFG'
    }
  });

  t.is(vm.$findOne('#a').$text, 'A');
  t.is(vm.$findOne('#b').$text, 'B');
  t.is(vm.$findOne('#c').$text, 'C');
});
