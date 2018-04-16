# vue-compose
Create awesome Vue HOCs

## Installation
```
npm install --save vue-compose
```

## Usage
```js
import {
  compose,
  withProps,
  defaultProps,
  withHandlers,
  withData,
  setName,
} from 'vue-compose';
import C from './component.vue';

const enhance = compose(
  withProps((props) => ({
    someProp: 'foo',
  })),
  defaultProps({
    notPassedIn: true
  }),
  withHandlers({
    someEvent(e){
      // do some stuff
    }
  }),
  withData({
    someDataProp: {
      initialValue: 'bah',
      listener: 'updateBah',
    }
  }),
  setName('My Component'),
);

const enhanced = enhance(C);
```

## API

### HOC Creators
The following methods will create a new HOC that wraps the provided component.
#### mapProps
```js
(
  mapper: (props : Object) => Object,
) => (Component) => Component;
```
Maps the props into a new object. Any props that are not returned will **not** be passed into the base component.
```js
mapProps((props) => ({
  propA: props.propA,
  propB: props.propB + 1,
}));
```

#### withProps
```js
(
  mapper: {
    [propName: string]: Object | (props: Object) => any
  } | (props : Object) => Object,
) => (Component) => Component;
```
Maps props into a new object. The returned object will be merged with the existing props.
```js
withProps({
  someStaticProp: 'foo'
});

withProps({
  someDynamicProp: (props) => props.propA + 1
});

withProps((props) => ({
  someDynamicProp: props.propA + 1
}))
```

#### defaultProps
```js
(
  defaults: Object,
) => (Component) => Component;
```
Sets default values for any props that are currently undefined.
```js
defaultProps({
  someProp: 'bah'
});
```

#### acceptProps
```js
(
 props: Object | Array<string>,
) => (Component) => Component;
```
Adds additional props to the component's props option. This allows you to accept props that aren't expected by the base component.
```js
compose(
  mapProps((props) => ({
    someOldProp: props.someNewProp
  })),
  acceptProps([ 'someNewProp' ]),
);
```

#### withHandlers
```js
(
  listeners: {
    [handlerName: string]: (...args: Array<any>) => any
  },
) => (Component) => Component;
```
Adds event listeners to the base component's `v-on` attribute.
```js
withHandlers({
  someEvent(arg){
    // do some event stuff
  }
});
```
If you add a listener, that event won't propagate any further. If you want to intercept an event but still propagate it, you will need to re-emit the event:
```js
withHandlers({
  someEvent(arg){
    // do some event stuff
    this.$emit('someEvent', arg);
  }
});
```
Handlers can access eachother with the `handle` prefix, meaning you can trigger one handler from another:
```js
withHandlers({
  click(e){
    /* ... */
  },
  dblClick(e){
    // do something
    this.handleClick(e);
  }
})
```

#### withPassive
```js
(
  listeners: {
    [handlerName: string]: (...args: Array<any>) => any
  },
) => (Component) => Component;
```
Just like `withHandlers` except the event is automatically propagated up.

#### withData
```js
(
  data: {
    [name: string]: {
      prop?: string,
      listener?: string,
      handler?: (...args: any) => any,
      initialValue?: any | (props: Object) => any,
    }
  },
) => (Component) => Component;
```
Creates a stateful HOC with the specified data properties.
##### name
The name of the data property. Note that if this conflicts with an incoming prop, it will kill the prop.
##### prop
The name of the prop that the data will be passed into. By default it is the same as `name`.
##### listener
The name of the event that will trigger the update handler. By default it is the same as `name`.
##### handler
A function that handles updating the data value when the `listener` event is emitted.
##### initialValue
The initial value for the data property. If it is a function, it will be evaluated when the HOC is instantiated.

Example with the default options:
```js
withData({
  something: {
    prop: 'something',
    listener: 'something',
    handler(v){
      this.something = v;
    },
    initialValue: undefined
  }
});
```

#### withHooks
```js
(
  hooks: {
    [hookName: string]: Function,
  },
) => (Component) => Component;
```
Adds hooks to the component, i.e. `beforeCreate`, `created`, `mounted`, etc.
```js
withHooks({
  mounted(){
    // some stuff here
  }
});
```

#### withClass
```js
(
  classes: any | (props: Object) => any,
) => (Component) => Component;
```
Adds classes to the base component.

#### withStyle
```js
(
  style: any | (props: Object) => any,
) => (Component) => Component;
```
Adds styles to the base component.

#### provide
```js
(
  provide: Object | () => Object
) => (Component) => Component;
```
Leverages Vue's `provide/inject` functionality. Use in conjunction with the `inject` method.

### Mutators
Mutators don't create a new HOC, but actually **mutate** the provided component with new attributes.
#### withComputed
```js
(
  computed: {
    [name: string]: Function
  },
) => (Component) => Component;
```
Adds computed properties to the component.
```js
compose(
  withComputed({
    compA(){
      return 'foo';
    }
  }),
  withProps({
    propA(){
      return this.compA;
    }
  }),
)
```

#### withMethods
```js
(
  methods: {
    [name: string]: Function
  },
) => (Component) => Component;
```
Adds methods to the component.
```js
compose(
  withMethods({
    methodA(){
      return 'foo';
    }
  }),
  withProps({
    propA(){
      return this.methodA();
    }
  }),
)
```

#### setName
```js
(
  name: string,
) => (Component) => Component;
```
Sets the name of the component.

### inject
```js
(
  inject: Array<string> | Object
) => (Component) => Component;
```
Injects data into the component provided by `provide`.

### Utilities
#### compose
```js
(
  ...hocCreators: Array<Function>
) => (ctor: Component) => Component;
```
Chain multiple HOCs together. Compose will combine the HOCs from right-to-left (or bottom-to-top). The result is a function that accepts a Component that will then be applied to all of the HOCs.

#### componentFromProp
```js
(
  propName: string | Component,
) => Component;
```
Creates a component using the provided prop value. The prop can either be a string - such as `'input'` or a component.
```js
const C = componentFromProp('component');
```
You can then use it like:
```html
<div>
  <C component="button"/>
</div>
```
or:
```html
<div>
  <C :component="MyComponent"/>
</div>
```

#### componentFromSlot
```js
(
  componentOptions?: Object
) => Component;
```
Creates a component that just outputs its slot content. This is useful if you want to apply styles etc. through a component, but don't want to render additional html elements.

Any props passed to this component will be passed through to the slot component.

> NOTE: This is still an experimental feature and should be used with caution.

A couple of important notes:
- There must only be one root element inside the compponent
- For multiple root elements, use a `<template>`

```js
const enhance = compose(
  withClass('someExtraClass'),
  withStyle({ width: '400px' }),
);
const C = ehance(componentFromSlot());
```
```html
<C>
  <div>I will now have someExtraClass and a width of 400px</div>
</C>
```

#### createSink
```js
(
  fn: (props: Object) => void,
) => Component;
```
Creates a sink component. This component does not render anything, or take any configuration options, but calls `fn` at render time. The `props` parameter contains all `props` and `attrs` passed into the component.

The createSink method is useful when unit testing your `compose` functions.

```js
import { enhance } from '../my-component';

it('passes a foo prop', (done) => {
  const Sink = createSink((props) => {
    expect(props.foo).to.equal('bah');
    done();
  });

  const Enhanced = enhance(Sink);

  mount(Enhanced);
});
```

## FAQ
#### Why is recompose.X missing?
React and Vue look very similar on the surface, but they are actually entirely different beasts. Vue handles a lot more stuff behind the scenes. It's quite easy for React developers to want to shoehorn React techniques into a Vue application, but often there is no need because Vue handles things differently.

A couple of examples:
- `withPropsOnChange`, `pure`, `onlyUpdateForKeys` - because of it's functional nature, React needs a bit of help deciding whether or not re-render components. This isn't something that Vue suffers with because of its reactive nature, it's already able to work out whether a component is *dirty*.
- `renameProp`, `flattenProp` - React's props are super flexible, meaning you can accept any random assortment of props and then reorganise them before passing them into the next component. Vue requires all props to be defined upfront (so it can watch them), so chances are the props will already be named correctly, and if you want to accept props under different names etc. you have to explicitly add them to the component with `acceptProps`.

#### Why isn't withHandlers wrapped in a closure?
Recompose's `withHandlers` accepts a function that returns the handler function. This means you have access to the component's props via a closure. Vue is predominantly OOP orientated (see below) so there is no need to wrap props in a closure as you can access them with `this.myProp` or `this.$props.myProp`.

#### Why are there not more functional HOCs?
Context! Vue is not really written for functional components, and although you can set the `functional` flag on a component, you still don't get a *truly functional* component in the React sense. Your render function still receives a `context` object with properties of the current state of the component. On top of that you lose a lot of Vue's awesome features like computed properties that make memoization totally unecessary. And finally, it is a lot harder to pass non-prop options through multiple functional hocs, because the entire context is not retained.

#### How can I use this with Vuex?
Easily. You can easily combine **vue-compose** with vuex's helper functions:
```js
const enhance = compose(
  withProps({
    ...mapState(['loading']),
    ...mapGetters('users', {
      name: 'userName'
    })
  }),
  withHandlers(
    mapActions('users', [
      'changeName'
    ])
  ),
);
```
