// @flow
import type {
  Ctor,
  CreateRenderFnOptions,
  CreateRenderFn,
  CreateRenderFnc,
} from './annotations';

import courier from './courier';
import normalizeSlots from './normalizeSlots';

export const createRenderFn: CreateRenderFn = (Component, options) => {
  let {attrs, listeners, props} = (options || {});

  return function renderHoc(h: Function) {
    if (typeof attrs === 'function'){
      attrs = attrs.call(this, this.$attrs || {});
    }else{
      attrs = Object.assign({}, this.$attrs, attrs);
    }
    if (typeof props === 'function'){
      props = props.call(this, this.$props || {});
    }else{
      props = Object.assign({}, this.$props, props);
    }
    if (typeof listeners === 'function'){
      listeners = listeners.call(this, this.$listeners || {});
    }else{
      if (listeners){
        listeners = Object.assign({}, listeners);
        Object.keys(listeners).forEach((key: string) => {
          // $FlowFixMe
          listeners[key] = listeners[key].bind(this)
        });
      }
      listeners = Object.assign({}, this.$listeners, listeners);
    }

    return h(Component, {
      attrs,
      props,
      on: listeners,
      scopedSlots: this.$scopedSlots
    }, normalizeSlots(this.$slots));
  };
};

export const createRenderFnc: CreateRenderFnc = courier(2, (
  options: CreateRenderFnOptions,
  Component: Ctor
) => {
  return createRenderFn(Component, options);
});
