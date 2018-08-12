import test from 'ava';
import sinon from 'sinon';
import { mount } from 'vuenit';

import { branch } from 'vue-compose';

const Component = {
  props: [ 'flag' ],
  template: '<div>original component</div>',
};
mount(Component);

test('renders trueFn when true', t => {
  const Wrapper = branch(
    (props) => props.flag === true,
    (h) => h('div', null, [ 'true' ]),
    (h) => h('div', null, [ 'false' ]),
  )(Component);

  const vm = mount(Wrapper, {
    props: {
      flag: true,
    },
  });
  const html = vm.$html;

  t.is(html, '<div>true</div>');
});

test('renders falseFn when false', t => {
  const Wrapper = branch(
    (props) => props.flag === true,
    (h) => h('div', null, [ 'true' ]),
    (h) => h('div', null, [ 'false' ]),
  )(Component);

  const vm = mount(Wrapper, {
    props: {
      flag: false,
    },
  });
  const html = vm.$html;

  t.is(html, '<div>false</div>');
});

test('falls back to original component when false', t => {
  const Wrapper = branch(
    (props) => props.flag === true,
    (h) => h('div', null, [ 'true' ]),
  )(Component);

  const vm = mount(Wrapper, {
    props: {
      flag: false,
    },
  });
  const html = vm.$html;

  t.is(html, '<div>original component</div>');
});
