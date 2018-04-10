import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {createHOC} from '../src';

const Component = {
  props : ['propA', 'propB'],
  template: `<ul>
    <li>{{propA}}</li>
    <li>{{propB}}</li>
  </ul>`
};

mount(Component);

test('can be a functional component', t => {
  const enhanced = createHOC(Component, {
    functional: true
  }, {
    props: {
      propB: 'baz'
    }
  });
  const vm = mount(enhanced, {
    props: {
      propA: 'foo',
      propB: 'bah'
    }
  });

  const list = vm.$find('li');

  t.is(list[0].$text, 'foo');
  t.is(list[1].$text, 'baz');
});
