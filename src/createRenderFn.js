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
  self: Object | void,
  context: Object | void,
  options: {
    attrs?: Object | (props: Object) => (Object | void),
    props?: Object | (props: Object) => (Object | void),
    listeners?: Object | (props: Object) => (Object | void)
  }
) => Object | void;

const normaliseN = (
  context: Object,
  userN: Object | void | (props: Object) => Object | void,
  ownerN: Object,
  bindToInstance?: boolean
): (Object | void) => {
  if (userN){
    if (typeof userN === 'function'){
      return userN.call(context, ownerN);
    }
    if (bindToInstance){
      userN = Object.assign({}, userN);
      Object.keys(userN).forEach(key => {
        // $FlowFixMe;
        userN[key] = userN[key].bind(context);
      });
    }
    return Object.assign({}, ownerN, userN);
  }
  return ownerN;
};
const normalizeAttrs: Normalizer = (self, context, options) => {
  const ownerAttrs = (context && context.data && context.data.attrs) || (self && self.$attrs) || {};
  const userAttrs = options.attrs;
  const ctx = context || self || {};
  return normaliseN(ctx, userAttrs, ownerAttrs);
};
const normaliseProps: Normalizer = (self, context, options) => {
  const ownerProps = (context && context.props) || (self && self.$props) || {};
  const userProps = options.props;
  const ctx = context || self || {};
  return normaliseN(ctx, userProps, ownerProps);
};
const normaliseListeners: Normalizer = (self, context, options) => {
  const ownerListeners = (context && context.listeners) || (self && self.$listeners) || {};
  const userListeners = options.listeners;
  const ctx = context || self || {};
  return normaliseN(ctx, userListeners, ownerListeners, true);
};

export const createRenderFn: CreateRenderFn = (Component, options) => {
  return function renderHoc(h: Function, context?: Object) {
    const props = normaliseProps(this, context, options || {});
    const attrs = normalizeAttrs(this, context, options || {});
    const on = normaliseListeners(this, context, options || {});
    const scopedSlots = (context && context.data && context.data.scopedSlots) || (this && this.$scopedSlots);
    const slots = (context && context.children) || (this && this.$slots && normalizeSlots(this.$slots)) || null;

    const data = Object.assign({}, options, {
      attrs,
      props,
      on,
      scopedSlots,
    });

    return h(Component, data, slots);
  };
};

export const createRenderFnc: CreateRenderFnc = courier(2, (
  options: CreateRenderFnOptions,
  Component: Ctor
) => {
  return createRenderFn(Component, options);
});
