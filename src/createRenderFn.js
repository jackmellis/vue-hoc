// @flow
import type {
  Ctor,
  CreateRenderFnOptions,
  CreateRenderFn,
  CreateRenderFnc,
} from './annotations';

import courier from './courier';
import normalizeSlots from './normalizeSlots';

const isObject = test => Object.prototype.toString.call(test) === '[object Object]';

const justBindOptions = [
  'listeners',
  'nativeOn',
  'scopedSlots',
];

const processOption = (
  context: Object,
  name: string,
  option: Function | Object | void
): Object => {
  const owner = context[`$${name}`] ||
                context.data && context.data[name] ||
                context[name];
  if (!option){
    return owner;
  }

  if (typeof option === 'function'){
    return option.call(context, owner);
  }else if (isObject(option)){
    const result = Object.assign({}, owner);
    Object.keys(option).forEach(key => {
      let value = option && option[key];
      if (typeof value === 'function'){
        if (justBindOptions.includes(name)){
          value = value.bind(context);
        }else{
          value = value.call(context, owner);
        }
      }
      result[key] = value;
    });
    return result;
  }else{
    return option;
  }
};

const processOptions = (
  context: Object,
  options: Object
): Object => {
  const keys = Object
    .keys(options)
    .concat(['listeners', 'props', 'attrs'])
    .filter((k, i, a) => a.indexOf(k) === i);
  const result = {
    on: {},
    props: {},
    attrs: {},
  };

  keys.forEach(key => {
    const value = processOption(context, key, options[key]);
    if (key === 'listeners'){
      key = 'on';
    }
    result[key] = value;
  });
  return result;
};

export const createRenderFn: CreateRenderFn = (Component, options) => {
  return function renderHoc(
    h: (
      ctor: Object,
      data: Object,
      slots: Array<any>
    ) => any,
    context?: Object
  ) {
    const data = processOptions(this || context || {}, options || {});
    const scopedSlots: Object = (context && context.data && context.data.scopedSlots) ||
                        (this && this.$scopedSlots);
    const slots: Array<any> = (context && context.children) || (this && this.$slots && normalizeSlots(this.$slots)) || [];

    data.scopedSlots = data.scopedSlots || scopedSlots;

    return h(Component, data, slots);
  };
};

export const createRenderFnc: CreateRenderFnc = courier(2, (
  options: CreateRenderFnOptions,
  Component: Ctor
) => {
  return createRenderFn(Component, options);
});
