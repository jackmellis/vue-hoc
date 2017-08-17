import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {createHOC, createRenderFn} from '../src';

const Component = {
  props : ['propA', 'propB'],
  template: `<ul>
    <li>{{propA}}</li>
    <li>{{propB}}</li>
  </ul>`
};

mount(Component);

test('props filter through hoc into component', t => {
  const enhance = createHOC({
  });
  const enhanced = enhance(Component);

  const vm = mount(enhanced, {
    props : {
      propA : 'foo',
      propB: 'bah',
    }
  });

  const expected = `<ul><li>foo</li><li>bah</li></ul>`;

  t.is(vm.$html, expected);
});

test('can overwrite prop values', t => {
  const enhance = createHOC({
    render : createRenderFn({
      props : {
        propA : 'bah',
        propB : 'foo'
      }
    })
  });
  const enhanced = enhance(Component);

  const vm = mount(enhanced, {
    props : {
      propA : 'foo',
      propB: 'bah',
    }
  });

  const expected = `<ul><li>bah</li><li>foo</li></ul>`;

  t.is(vm.$html, expected);
});

test('can amend prop values with a function', t => {
  const enhance = createHOC({
    render: createRenderFn({
      props(props){
        return {
          propA : this.$props.propB,
          propB : props.propA,
        };
      }
    })
  });
  const enhanced = enhance(Component);

  const vm = mount(enhanced, {
    props : {
      propA : 'foo',
      propB: 'bah',
    }
  });

  const expected = `<ul><li>bah</li><li>foo</li></ul>`;

  t.is(vm.$html, expected);
});

test('can add additional props', t => {
  const enhance = createHOC({
    props : ['propB', 'propC'],
    render : createRenderFn({
      props(props){
        t.is(Object.hasOwnProperty.call(props, 'propA'), false);
        t.is(Object.hasOwnProperty.call(props, 'propB'), true);
        return {
          propA : props.propC[0],
          propB : props.propC[1]
        };
      }
    })
  });
  const enhanced = enhance(Component);

  const vm = mount(enhanced, {
    props : {
      propA : 'foo',
      propB : 'bah',
      propC : ['abc', 'def']
    }
  });

  // so because we have redeclared props, propA is now just passed as an attribute
  const expected = `<ul propa="foo"><li>abc</li><li>def</li></ul>`;

  t.is(vm.$html, expected);
});

test('can pass props through multiple hocs', t => {
  const hoc1 = createHOC({}, Component);
  const hoc2 = createHOC({}, hoc1);

  const vm = mount(hoc2, {
    props : {
      propA : 'foo',
      propB : 'bah',
    }
  });

  const expected = `<ul><li>foo</li><li>bah</li></ul>`;

  t.is(vm.$html, expected);
});
