# vue-hoc
Create Higher Order Vue Components

Inspired by https://github.com/vuejs/vue/issues/6201

Sister projects: [vue-compose](https://www.npmjs.com/package/vue-compose) and [vuex-compose](https://www.npmjs.com/package/vuex-compose)

## Installation
```
npm install --save vue-hoc
```

## Usage
The simplest way to create a Higher Order Component is with the `createHOC` method. It takes a base component, a set of component options to apply to the HOC, and a set of *data* properties to pass to the component during render.
```js
import { createHOC } from 'vue-hoc';
import MyComponent from '../my-component';

const options = {
  name: 'MyEnhancedComponent',
  computed: {
    myComputedProperty(){
      return this.someProp + ' computed';
    }
  },
  created(){
    console.log('Created')
  }
};

const renderWith = {
  props: {
    someProp(){
      return this.myComputedProperty;
    }
  },
  listeners: {
    someEvent(arg){
      this.$emit('someOtherEvent', arg);
    }
  }
};

const enhanced = createHOC(MyComponent, options, renderWith);
```
The resulting HOC component will render the base component, but will pass in the value of `myComputedProperty` in place of `someProp`.

The alt method `createHOCc` exposes a curried version of the same method, where the component is the last argument, allowing you to write *HOC creators* and potentially chain up multiple hocs:
```js
import { createHOCc } from 'vue-hoc';
import { compose } from 'ramda';
import MyComponent from '../my-component';

const withCreatedHook = createHOCc({
  created(){
    console.log('Created');
  }
}, null);

const withAmendedProp = createHOCc(null, {
  props: {
    someProp(){
      return this.someProp + ' amended';
    }
  }
});

// we can now create a HOC using these methods
const MyComponent2 = withCreatedHook(MyComponent);

// and we can do multiple hocs:
const MyComponent3 = withAmendedProp(withCreatedHook(MyComponent));

// and with a composer like ramda's compose, we can make it more readable:
const enhance = compose(
  withAmendedProp,
  withCreatedHook
);
const MyComponent4 = enhance(MyComponent);
```

## API
### createHOC
```js
(Component: Object | Function, options?: Object, renderWith?: Object) => Object;
```
Wraps a component in a higher order component. Any props, listeners, and attributes will be passed through the HOC into the original Component.
```js
const hocComponent = createHOC(Component);
```

#### options
The options object will be used as the HOC's component definition. Here you can pass any valid [component definition options](https://vuejs.org/v2/api/#Options-Data).
```js
const withCreatedHook = createHOC(Component, {
  created(){
    console.log(this.someProp);
    // Where some prop is a prop defined on the original component.
    // The HOC will have access to it and it will still be passed on to the original component.
  }
});
```
**vue-hoc** will automatically inherit the base component's props so you can access these from within the hoc and they will be passed into the base component during the render. If you set a new value for props, it will be merged with the inherited props using Vue's [option merging strategies](https://vuejs.org/v2/api/#optionMergeStrategies).
```js
createHOC(Component, {
  props: ['someAdditionalProp']
});
```

**vue-hoc** will also automatically create a render function for the HOC, but you can override this by setting a `render` function yourself. Keep in mind, however, that a custom render function will no longer handle the `renderWith` options.
```js
createHOC(Component, {
  render(h){
    /* ... */
  }
});
```

#### renderWith
The renderWith object allows you to amend what props, listeners and attributes will be passed into the child component. In actuality, you can pass in any property that is accepted by Vue's [createElement](https://vuejs.org/v2/guide/render-function.html#The-Data-Object-In-Depth) method.

>The exception is that the `on` property is renamed to `listeners`.

Each option can be one of the following formats:
```js
{
  [name: string]: any
}
```
This will just pass static properties into the component instance. i.e.
```js
createHOC(Component, null, {
  props: {
    staticProp: 'foo',
    otherStaticProp: [1, 2, 3]
  }
});
```
The properties will be merged into the existing properties.

```js
{
  [name: string]: (owner: Object) => any
}
```
This allows you to calculate specific properties individually. You can also include static properties alongisde this. i.e.
```js
createHOC(Component, null, {
  props: {
    dynamicProp(props){
      return props.someProp + ' dynamic';
    },
    otherDynamicProp(){
      return this.someOtherProp + ' dynamic';
    },
    staticProp: 'foo'
  }
});
```
The properties will be merged into the existing properties.

Keep in mind that `listeners`, `nativeOn`, and `scopedSlots` are meant to be functions so they will not be evaluated.

```js
(owner: Object) => any
```
This allows to return the entire property object. i.e.
```js
createHOC(Component, null, {
  props(props){
    return {
      ...props,
      dynamicProp: 'dynamic'
    };
  }
});
```
Unlike the previous variants, this will *not* automatically merge with the existing properties.

### createHOCc
```js
(options: Object, renderWith?: Object) => (Component: Object | Function) => Object;
```
This is a curried variation of the `createHOC` method. This allows you to build a HOC creator and pass in a component at the end.

### createRenderFn
```js
(Component: Object, renderWith?: Object)=> Function;
```
createRenderFn is responsible for rendering the wrapped component in your hoc.
```js
const hoc = createHOC(Component, {
  render: createRenderFn(Component, {})
});
```
It is already used by `createHOC` to generate the render property of the component so you do not need to pass it in every time.

#### options
See [renderWith](#renderwith).

### createRenderFnc
```js
(options: Object) => (Component: Object)=> Function;
```
A curried version of `createRenderFn`.

### normalizeSlots
```js
(slots: Object) => Array<Object>;
```
A simple method that takes a component's slots and converts them into an array. This is used to pass distributed content from a parent to a child component during the render.
