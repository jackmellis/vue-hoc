# Vuex Compose

## API

### mapStateToProps
*alias: withState*  
```js
(
  namespace?: string,
  map:  Array<string> | { [key]: string | Function },
) => (Component) => Component
```
Maps state to props, effectively the same as using Vuex's `mapState` within your component.

Namespacing is slightly different to `mapState`. If you have a module where `namespaced: false`, you can still provide a namespace to drill down into the module's state.

```js
mapStateToProps('myModule', {
  myPropName: 'myStateValue',
});
```

### mapGettersToProps
*alias: withGetters*  
```js
(
  namespace?: string,
  map: Array<string>,
) => (Component) => Component
```

### mapGettersToComputed
```js
(
  namespace?: string,
  map: Array<string>,
) => (Component) => Component
```

### mapMutationsToHandlers
*alias: withMutations*
```js
(
  mutations: {
    [key]: string,
  },
) => (Componet) => Component
```
Maps mutations to event handlers. When the specified key is emitted, the mutation will be committed with the provided payload.

```js
compose(
  mapMutationsToHandlers({
    submit: 'SUBMIT',
  }),
  lifecycle({
    created(){
      this.$emit('submit', this.payloadValues);
    },
  }),
)
```

### mapActionsToHandlers
*alias: withActions*
```js
(
  namespace?: string,
  map: {
    [key]: string,
  },
) => (Component) => Component
```

### mapActionsToMethods
```js
(
  namespace?: string,
  map: {
    [key]: string,
  },
) => (Component) => Component
```

### mapActionsToProps
```js
(
  namespace?: string,
  map: {
    [key]: string,
  },
) => (Component) => Component
```

### mapActionCreatorsToHandlers
*alias: withActionCreators*
```js
(
  map: {
    [key]: Function,
  },
) => (Component) => Component
```

### mapActionCreatorsToMethods
```js
(
  map: {
    [key]: Function,
  },
) => (Component) => Component
```

### mapActionCreatorsToProps
```js
(
  map: {
    [key]: Function,
  },
) => (Component) => Component
```

### registerModule
```js
(
  namespace: string | Array<string>,
  module: Object,
)
```
Registers a provided module, only if it has not already been registered previously.

### compose
```js
(
  ...hocCreators: Array<Function>
) => (Component) => Component;
```
