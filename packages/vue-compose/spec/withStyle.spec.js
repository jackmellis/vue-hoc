import test from 'ava';
import {mount} from 'vuenit';
import {withStyle, withProps, compose} from 'vue-compose';

const Component = {
  props: ['className'],
  template: '<div style="width:100%;"></div>'
};
mount(Component);

test('adds a style to the base component', t => {
  const enhance = withStyle('color:red;');
  const enhanced = enhance(Component);
  const el = mount(enhanced).$el;

  t.is(el.style.color, 'red');
});

test('adds conditional styles to the base component', t => {
  const enhanced = withStyle({
    width: '50%',
    color: false,
    backgroundColor: 'blue',
  })(Component);
  const el = mount(enhanced).$el;

  t.is(el.style.width, '50%');
  t.is(el.style.color, '');
  t.is(el.style.backgroundColor, 'blue');
});

test('adds styles from a function', t => {
  const enhanced = withStyle(function(){
    return this.className;
  })(Component);
  const el = mount(enhanced, {
    props: {
      className: {
        width: '50%',
      },
    },
  }).$el;
  t.is(el.style.width, '50%');
});

test('adds styles from a getter', t => {
  const enhanced = withStyle({
    color: () => 'red',
  })(Component);
  const el = mount(enhanced).$el;

  t.is(el.style.color, 'red');
});

test('does not overwrite original styles', t => {
  const enhance = withStyle('color:red');
  const enhanced = enhance(Component);
  const el = mount(enhanced).$el;

  t.is(el.style.width, '100%');
});

test('can be chained to other withClasses', t => {
  const enhanced1 = withStyle({color:'red'})(Component);
  const enhanced2 = withStyle({backgroundColor:'blue'})(enhanced1);
  const el = mount(enhanced2).$el;

  t.is(el.style.color, 'red');
  t.is(el.style.backgroundColor, 'blue');
  t.is(el.style.width, '100%');
});

test('can be chained with other hocs', t => {
  const enhanced = compose(
    withStyle({
      width: '100%'
    }),
    withStyle(() => ({
      height: '400px'
    })),
    withProps({
      foo: 'bah'
    }),
    withStyle({
      color: () => 'green'
    }),
  )(Component);
  const el = mount(enhanced).$el;

  t.is(el.style.color, 'green');
  t.is(el.style.height, '400px');
  t.is(el.style.width, '100%');
});

test('passes through parent classes', t => {
  const enhanced1 = withStyle('color:red')(Component);
  const enhanced2 = withStyle('backgroundColor:blue')(enhanced1);
  const el = mount({
    template: '<enhanced2 style="opacity:0.5;"/>',
    components: {
      enhanced2
    }
  }).$el;

  t.is(el.style.color, 'red');
  t.is(el.style.backgroundColor, 'blue');
  t.is(el.style.opacity, '0.5');
  t.is(el.style.width, '100%');
});
