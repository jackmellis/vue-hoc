// @flow
export const courier = (
  count: number,
  fn: Function,
): Function => {
  return function(...partialArgs: Array<any>){
    let args = [];

    function curried(...partialArgs: Array<any>){
      args = args.concat(partialArgs);
      if (args.length < count){
        return curried;
      }else{
        return fn.apply(this, args);
      }
    }
    curried.curried = true;

    return curried.apply(this, partialArgs);
  };
};


export const normalizeSlots = (slots: Object): Array<any> => Object.keys(slots)
  .reduce((arr, key) => arr.concat(slots[key]), []);

// TODO: define types
type CreateRenderFnOptions = {
  attrs: Object | (attrs: Object) => Object,
  props: Object | (props: Object) => Object,
  listeners: Object | (listeners: Object) => Object,
};
type CreateRenderFn = () => Function;
export const createRenderFn = courier(2, (options, Component) => {
  let {attrs, listeners, props} = (options || {});

  return function renderHoc(h) {
    if (typeof attrs === 'function'){
      attrs = attrs.call(this, this.$attrs || {});
    }
    if (typeof props === 'function'){
      props = props.call(this, this.$props || {});
    }
    if (typeof listeners === 'function'){
      listeners = listeners.call(this, this.$listeners || {});
    }
    attrs = Object.assign({}, this.$attrs, attrs);
    props = Object.assign({}, this.$props, props);
    listeners = Object.assign({}, this.$listeners, listeners);

    return h(Component, {
      attrs,
      props,
      on: listeners,
      scopedSlots: this.$scopedSlots
    }, normalizeSlots(this.$slots));
  };
});

export const createHOC = courier(2, (options, Component) => {
  options = options || {};
  const hoc = Object.assign({
    props: (typeof Component === 'function')
      ? Component.options.props
      : Component.props,
    mixins: [],
    name: (Component.name || 'Annonymous') + 'HOC',
    render: createRenderFn(options.with),
  }, options);

  hoc.mixins.push({
    created(){
      this.$createElement = this.$parent.$createElement;
    }
  });

  if (hoc.render.curried){
    hoc.render = hoc.render(Component);
  }

  return hoc;
});

export default createHOC;
