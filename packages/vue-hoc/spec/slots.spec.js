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
mount(Component);

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

test('it renders multiple slots', t => {
  const hoc = createHOC(createHOC(Component));
  const vm = mount(hoc, {
    innerHTML: '<div id="first">first</div><div id="second">second</div><div slot="named_slot" id="third">third</div><div slot="named_slot" id="fourth">fourth</div>',
  });
  t.true(vm.$contains('#first'));
  t.true(vm.$contains('#second'));
  t.true(vm.$contains('#third'));
  t.true(vm.$contains('#fourth'));
});

test('it renders text slot content', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: 'some text',
  });

  t.true(vm.$html.includes('some text'));
});

test('it renders a mix of text and tags', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: 'some text <span id="icon">icon</span> some more text',
  });

  t.true(vm.$contains('#icon'));
  t.true(vm.$html.includes('some text'));
  t.true(vm.$html.includes('some more text'));
});

test('it renders a mix of tags and text', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: '<span id="icon">icon</span> some text',
  });

  t.true(vm.$contains('#icon'));
  t.true(vm.$html.includes('some text'));
});

test('it renders a mix of tags text and templates', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: '<span id="icon">icon</span> some text<template><div>some template stuff</div>!</template>',
  });

  t.true(vm.$contains('#icon'));
  t.true(vm.$html.includes('some text'));
  t.true(vm.$html.includes('some template stuff'));
});
