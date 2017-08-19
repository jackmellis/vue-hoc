import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {createHOC, createRenderFn} from '../src';

const Component = {
  template : `<div></div>`,
};
mount(Component);

test('adds a created hook', t => {
  const spy = sinon.spy();
  const hoc = createHOC(Component, {
    created(){
      spy();
    },
  });
  const vm = mount(hoc);

  t.true(spy.called);
});
