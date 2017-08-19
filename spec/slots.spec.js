import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {createHOC, createRenderFn} from '../src';

const Component = {
  template : `<div>
                <slot></slot>
                <slot name="named_slot"></slot>
              </div>`
};

test('it renders a slot', t => {
  const vm = mount(Component, {
    slots: {
      default: '<div id="default"></div>',
      named_slot: '<div id="named"></div>'
    }
  });
  t.true(vm.$contains('#default'));
  t.true(vm.$contains('#named'));
});

test('it passes slots through a hoc', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: {
      default: '<div id="default"></div>',
      named_slot: '<div id="named"></div>'
    }
  });
  t.true(vm.$contains('#default'));
  t.true(vm.$contains('#named'));
});

test('passes slots through multiple hocs', t => {
  const hoc1 = createHOC(Component);
  const hoc2 = createHOC(hoc1);
  const vm = mount(hoc2, {
    slots: {
      default: '<div id="default"></div>',
      named_slot: '<div id="named"></div>'
    }
  });
  t.true(vm.$contains('#default'));
  t.true(vm.$contains('#named'));
});
