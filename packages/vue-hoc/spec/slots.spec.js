import test from 'ava';
import sinon from 'sinon';
import {mount} from 'vuenit';
import {
  createHOC,
  createRenderFn,
  createHOCc,
} from '../src';

const Component = {
  template : `<div>
                <slot></slot>
                <slot name="named_slot"></slot>
                <div>
                  <slot name="other_slot"></slot>
                </div>
              </div>`
};
mount(Component);

const Dynamic = {
  template: `
      <component :is="wrappedComponent">
        <div :slot="'other_slot'">other differently</div>
        <slot slot="named_slot" name="named_slot">named differently</slot>
        <template slot="default"><slot name="default">named differently</slot></template>
      </component>
    `,
  props: {
    wrappedComponent: Object
  }
};
mount(Dynamic);

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
test('it renders named slots in order', t => {
  const hoc =createHOC(Component);
  const vm = mount(hoc, {
    innerHTML: `
      <div slot="other_slot">other</div>
      <div>default</div>
      <div slot="named_slot">named</div>
    `,
  });
  const html = vm.$html;

  t.is(html, '<div><div>default</div><div>named</div><div><div>other</div></div></div>');
});

test('(Component) it renders text slot content', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: 'some text',
  });
  const html = vm.$html;

  t.true(html.includes('some text'));
});
test('it renders dynamic named slots in order', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    innerHTML: `
      <div :slot="'other_slot'">other</div>
      <div>default</div>
      <template :slot="'named_slot'">named</template>
    `,
  });
  const html = vm.$html;

  t.is(html, '<div><div>default</div>named<div><div>other</div></div></div>');
});
test('it renders template slots in dynamic component', t => {
  const hoc = createHOC(Dynamic, null, {
    props: {
      wrappedComponent: Component
    }
  });
  const vm = mount(hoc, {
    innerHTML: `
      <div slot="other_slot">other</div>
      <div>default</div>
      <template slot="named_slot"><div>named</div><div>named 2</div></template>
      <div>default 2</div>
    `,
  });
  const html = vm.$html;

  t.is(html, '<div><div>default</div><div>default 2</div><div>named</div><div>named 2</div><div><div>other differently</div></div></div>');
});

test('(string) it renders text slot content', t => {
  const hoc = createHOC('button');
  const vm = mount(hoc, {
    slots: 'some text',
  });
  const html = vm.$html;
  t.true(html.includes('some text'));
});

test('(Component) it renders a mix of text and tags', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: 'some text <span id="icon">icon</span> some more text',
  });
  const html = vm.$html;

  t.true(vm.$contains('#icon'));
  t.true(html.includes('some text'));
  t.true(html.includes('some more text'));
});

test('(string) it renders a mix of text and tags', t => {
  const hoc = createHOC('button');
  const vm = mount(hoc, {
    slots: 'some text <span id="icon">icon</span> some more text',
  });
  const html = vm.$html;

  t.true(vm.$contains('#icon'));
  t.true(html.includes('some text'));
  t.true(html.includes('some more text'));
});

test('(Component) it renders a mix of tags and text', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: '<span id="icon">icon</span> some text',
  });
  const html = vm.$html;

  t.true(vm.$contains('#icon'));
  t.true(html.includes('some text'));
});

test('(string) it renders a mix of tags and text', t => {
  const hoc = createHOC('button');
  const vm = mount(hoc, {
    slots: '<span id="icon">icon</span> some text',
  });
  const html = vm.$html;

  t.true(vm.$contains('#icon'));
  t.true(html.includes('some text'));
});

test('(Component) it renders a mix of tags text and templates', t => {
  const hoc = createHOC(Component);
  const vm = mount(hoc, {
    slots: '<span id="icon">icon</span> some text<template><div>some template stuff</div>!</template>',
  });
  const html = vm.$html;

  t.true(vm.$contains('#icon'));
  t.true(html.includes('some text'));
  t.true(html.includes('some template stuff'));
});

test('(string) it renders a mix of tags text and templates', t => {
  const hoc = createHOC('button');
  const vm = mount(hoc, {
    slots: '<span id="icon">icon</span> some text<template><div>some template stuff</div>!</template>',
  });
  const html = vm.$html;

  t.true(vm.$contains('#icon'));
  t.true(html.includes('some text'));
  t.true(html.includes('some template stuff'));
});

test('provide string element in a curried hoc should not contain element not provided', t => {
  const hoc = createHOCc(null, null)('div')
  const vm = mount(hoc, {
    slots: {
      default:
        'foo' +
        '<div>another foo</div>'
    }
  });

  t.is(vm.$html,
    '<div>' +
      'foo' +
      '<div>another foo</div>' +
    '</div>'
  );
  t.false(vm.$html.includes('<template>'));
});
