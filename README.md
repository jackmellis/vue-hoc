# vue-hoc
Create Higher Order Vue Components

## createHOC
```js
(Component: Object | Function, options?: Object, renderOptions?: Object) => Object;
```
Wraps a component in a higher order component. Any props, listeners, and attributes will be passed through the HOC into the original Component.
```js
const hocComponent = createHOC(Component);
```

### options
The options object will be used as the HOC's component definition.
```js
const withCreatedHook = createHOC(Component, {
  created(){
    console.log(this.someProp);
    // Where some prop is a prop defined on the original component.
    // The HOC will have access to it and it will still be passed on to the original component.
  }
});
```
### renderOptions
The renderOptions object allows you to amend what props, listeners and attributes will be passed into the child component. For more information on the available options, see the [`createRenderFn`](#createRenderFn) method.
```js
const withEventHandler = createHOC(Component, null, {
  listeners: {
    customEvent(){
      this.$store.dispatch('action');
    }
  }
});
```

## createHOCc
```js
(options: Object, renderOptions: Object, Component: Object | Function) => Object;
```
This is a curried variation of the `createHOC` method. This allows you to build a HOC creator and pass in a component at the end.
```js
const withCreatedHook = createHOCc({
  created(){
    console.log('created');
  }
}, null);

const hoc = withCreatedHook(Component);
```

## createRenderFn
```js
(Component: Object, options?: Object)=> Function;
```
createRenderFn is responsible for rendering the wrapped component in your hoc.
```js
const hoc = createHOC(Component, {
  render: createRenderFn(Component, {})
});
```
It is already used by `createHOC` to generate the render property of the component so you do not need to pass it in every time.

### options
#### props
```js
Object | (props: Object) => Object;
```

The props that will be passed into the wrapped component. If props is an object, it will be merged in with the original props.
```js
createRenderFn(Component, {
  props: {
    propA: 'foo'
  }
});
```
If props is a function, it will be invoked during the render and will *not* be merged with the original props. The function receives the original props as its argument and `this` is the hoc instance.
```js
createRenderFn(Component, {
  props(props) {
    return {
      ...props,
      propA: 'foo'
    };
  }
});
```

#### attrs
```js
Object | (attrs: Object) => Object;
```
The attributes that will be passed into the wrapped component. If attrs is an object, it will be merged in with the original attributes.
```js
createRenderFn(Component, {
  attrs: {
    id: 'bah'
  }
});
```
If attrs is a function, it will be invoked during the render and will *not* be merged with the original attrs. The function receives the original attrs as its argument and `this` is the hoc instance.
```js
createRenderFn(Component, {
  attrs(attrs){
    return {
      id: 'bah'
    };
  }
});
```

#### listeners
```js
Object | (listeners: Object) => Object;
```
```js
Object | (attrs: Object) => Object;
```
Event handlers that will be invoked when the component emits the event name. If listeners is an object, it will be merged in with the original attributes. Each listener will be bound to the HOC component
```js
createRenderFn(Component, {
  listeners: {
    click(e){
      this.$emit('click', e);
    }
  }
});
```
If listeners is a function, it will be invoked during the render and will *not* be merged with the original listeners. Also, the listeners will not automatically be bound to the component.
```js
createRenderFn(Component, {
  listeners(listeners){
    return {
      ...listeners,
      click: (e) => this.$emit('click', e);
    };
  }
});
```

## createRenderFnc
```js
(options: Object, Component: Object)=> Function;
```
A curried version of `createRenderFn`.

## normalizeSlots
```js
(slots: Object) => Array<Object>;
```
A simple method that takes a component's slots and converts them into an array. This is used to pass distributed content from a parent to a child component during the render.
