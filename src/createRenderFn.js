// @flow
import courier from './courier';
import normalizeSlots from './normalizeSlots';
import assign from './assign';

import type {
  Ctor,
  CreateRenderFnOptions,
  CreateRenderFn,
  CreateRenderFnc,
} from './annotations';

const isObject = test => Object.prototype.toString.call(test) === '[object Object]';
const isFn = test => Object.prototype.toString.call(test) === '[object Function]';

const justBindOptions = [
  'listeners',
  'nativeOn',
  'scopedSlots',
];

const justBindFn = key => justBindOptions.indexOf(key) > -1;

const getOptionsKeys = options => Object
  .keys(options)
  .concat(['listeners', 'props', 'attrs'])
  .filter((k, i, a) => a.indexOf(k) === i);

const createOptionHandlers = (originalOptions, keys) => {
  const options: {
    [dataName: string]: Function
  } = {};

  keys.forEach(key => {
    const option = originalOptions[key];

    if (!option){
      options[key] = owner => owner;
      return;
    }

    if (isFn(option)){
      // $FlowFixMe
      options[key] = option;
      return;
    }

    if (isObject(option)){
      const optionKeys = Object.keys(option);

      if (!optionKeys.some(k => isFn(option[k]))){
        options[key] = (owner) => assign({}, owner, option);
        return;
      }

      options[key] = function(owner) {
        const result = assign({}, owner);
        const justBind = justBindFn(key);

        optionKeys.forEach(k => {
          let value = option && option[k];

          if (isFn(value)){
            if (justBind){
              value = value.bind(this);
            }else{
              value = value.call(this, owner);
            }
          }
          result[k] = value;
        });
        return result;
      };
      return;
    }

    options[key] = () => option;
  });

  return options;
};

const preprocessOptions = (originalOptions) => {
  const keys = getOptionsKeys(originalOptions);
  const options = createOptionHandlers(originalOptions, keys);

  return (context, isFunctional) => {
    const result: {
      on: Object,
      props: Object,
      attrs: Object,
      scopedSlots?: Object,
    } = {
      on: {},
      props: {},
      attrs: {},
    };

    keys.forEach(key => {
      const owner = isFunctional ?
        context[key] || context.data[key] :
        context[`$${key}`];

      const value = options[key].call(context, owner);

      if (key === 'listeners'){
        key = 'on';
      }

      result[key] = value;
    });

    return result;
  };
};


export const createRenderFn: CreateRenderFn = (Component, options) => {
  const getData = preprocessOptions(options || {});

  return function renderHoc(
    h: (
      ctor: Object,
      data: Object,
      slots: Array<any>
    ) => any,
    context?: Object
  ) {
    //const data = processOptions(this || context || {}, options || {});
    const data = getData(context || this, !!context);
    const scopedSlots: Object = (context && context.data && context.data.scopedSlots) ||
                        (this && this.$scopedSlots);
    const slots: Array<any> = (context && context.children) || (this && this.$slots && normalizeSlots(this.$slots, this.$parent)) || [];

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
