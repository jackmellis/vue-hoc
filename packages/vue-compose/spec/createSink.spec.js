import test from 'ava';
import sinon from 'sinon';
import { mount } from 'vuenit';
import {
  createSink,
  compose,
  withProps,
  withHandlers,
} from 'vue-compose';

test('creates a sink component', t => {
  const spy = sinon.spy();
  const sink = createSink(spy);

  t.false(spy.called);
  mount(sink);
  t.true(spy.called);
});

test('sink is called with all attributes and props', t => {
  const sink = createSink((props) => {
    t.is(props.foo, 'foo');
    t.is(props.bah, 'bah');
  });

  mount(sink, {
    props: {
      foo: 'foo',
      bah: 'bah',
    },
  });
});

test('sink is called with context', t => {
  const sink = createSink(function(){
    t.is(this.$options.name, 'Sink');
  });

  mount(sink);
});

test('allows easy testing of hocs', t => {
  const spy = sinon.spy();
  const enhance = compose(
    withProps({
      foo: 'bah',
    }),
    withHandlers({
      click: spy,
    }),
  );
  const sink = createSink(function (props) {
    t.is(props.foo, 'bah');
    this.$emit('click');
  });

  mount(enhance(sink));

  t.true(spy.called);
});
