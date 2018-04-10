import test from 'ava';
import {mount} from 'vuenit';
import {withClass} from 'vue-compose';

const Component = {
  props: ['className'],
  template: '<div class="original"></div>'
};
mount(Component);

test('adds a class to the base component', t => {
  const enhance = withClass('classA');
  const enhanced = enhance(Component);
  const el = mount(enhanced).$el;

  t.true(el.classList.contains('classA'));
});

test('adds an array of classes to the base component', t => {
  const enhanced = withClass(['classA', 'classB'])(Component);
  const el = mount(enhanced).$el;

  t.true(el.classList.contains('classA'));
  t.true(el.classList.contains('classB'));
});

test('adds conditional classes to the base component', t => {
  const enhanced = withClass({
    classA: true,
    classB: false,
    classC: true,
  })(Component);
  const el = mount(enhanced).$el;

  t.true(el.classList.contains('classA'));
  t.false(el.classList.contains('classB'));
  t.true(el.classList.contains('classC'));
});

test('adds classes from a function', t => {
  const enhanced = withClass(function(){
    return this.className;
  })(Component);
  const el = mount(enhanced, {
    props: {
      className: 'classA'
    }
  }).$el;
  t.true(el.classList.contains('classA'));
});

test('adds classes from a getter', t => {
  const enhanced = withClass({
    classA: () => true,
    classB: () => false,
    classC: () => true,
  })(Component);
  const el = mount(enhanced).$el;

  t.true(el.classList.contains('classA'));
  t.false(el.classList.contains('classB'));
  t.true(el.classList.contains('classC'));
});

test('does not overwrite original classes', t => {
  const enhance = withClass('classA');
  const enhanced = enhance(Component);
  const el = mount(enhanced).$el;

  t.true(el.classList.contains('original'));
});

test('can be chained to other withClasses', t => {
  const enhanced1 = withClass('classA')(Component);
  const enhanced2 = withClass('classB')(enhanced1);
  const el = mount(enhanced2).$el;

  t.true(el.classList.contains('classA'));
  t.true(el.classList.contains('classB'));
  t.true(el.classList.contains('original'));
});

test('passes through parent classes', t => {
  const enhanced1 = withClass('classA')(Component);
  const enhanced2 = withClass('classB')(enhanced1);
  const el = mount({
    template: '<enhanced2 class="classC"/>',
    components: {
      enhanced2
    }
  }).$el;

  t.true(el.classList.contains('classA'));
  t.true(el.classList.contains('classB'));
  t.true(el.classList.contains('classC'));
  t.true(el.classList.contains('original'));
});
