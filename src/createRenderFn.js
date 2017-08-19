// @flow
import type {
  Ctor,
  CreateRenderFnOptions,
  CreateRenderFn,
  CreateRenderFnc,
} from './annotations';

import courier from './courier';
import normalizeSlots from './normalizeSlots';

type Normalizer = (
  self?: Object,
  context?: Object,
  options: {
    attrs?: Object,
    props?: Object,
    listeners?: Object
  }
) => Object | void;

const normaliseN = (
  context?: Object,
  userN?: Object | Function,
  ownerN?: Object,
  bindToInstance?: boolean
): (Object | void) => {
  if (userN){
    if (typeof userN === 'function'){
      return userN.call(context, ownerN);
    }
    if (bindToInstance){
      userN = Object.assign({}, userN);
      // $FlowFixMe
      Object.keys(userN).forEach(key => userN[key] = userN[key].bind(context));
    }
    return Object.assign({}, ownerN, userN);
  }
  return ownerN;
};
const normalizeAttrs: Normalizer = (self, context, options) => {
  const ownerAttrs = (context && context.data && context.data.attrs) || (self && self.$attrs) || {};
  const userAttrs = options.attrs;
  return normaliseN(context || self, userAttrs, ownerAttrs);
}
const normaliseProps: Normalizer = (self, context, options) => {
  const ownerProps = (context && context.props) || (self && self.$props) || {};
  const userProps = options.props;
  return normaliseN(context || self, userProps, ownerProps);
}
const normaliseListeners: Normalizer = (self, context, options) => {
  const ownerListeners = (context && context.listeners) || (self && self.$listeners) || {};
  const userListeners = options.listeners;
  return normaliseN(context || self, userListeners, ownerListeners, true);
}

export const createRenderFn: CreateRenderFn = (Component, options) => {
  return function renderHoc(h: Function, context?: Object) {
    const props = normaliseProps(this, context, options || {});
    const attrs = normalizeAttrs(this, context, options || {});
    const listeners = normaliseListeners(this, context, options || {});
    const scopedSlots = (context && context.data && context.data.scopedSlots) || (this && this.$scopedSlots);
    const slots = (context && context.children) || (this && this.$slots && normalizeSlots(this.$slots)) || null;

    return h(Component, {
      attrs,
      props,
      on: listeners,
      scopedSlots
    }, slots);
  };
};

export const createRenderFnc: CreateRenderFnc = courier(2, (
  options: CreateRenderFnOptions,
  Component: Ctor
) => {
  return createRenderFn(Component, options);
});
