import normalizeSlots from './normalizeSlots';
import getProps from './getProps';
import { CURRIED } from './constants';
import {
  assign,
  isObject,
  isFunction,
} from './utils';

// most options can provide a factory function to calculate the value at render time
// but these options are already menat to be functions, so we don't invoke them
// during the hoc creation phase
const justBindOptions = [
  'listeners',
  'nativeOn',
  'scopedSlots',
];

const justBindFn = (key) => justBindOptions.indexOf(key) > -1;

// ensures the keys always contain listeners/props/attrs
const getOptionsKeys = (options) => Object
  .keys(options)
  .concat(['listeners', 'props', 'attrs'])
  .filter((option, i, arr) => arr.indexOf(option) === i);

// for every option, we want to have a factory function that returns
// the actual result
const createOptionHandlers = (originalOptions, keys) => {
  const options = {};

  keys.forEach((key) => {
    const option = originalOptions[key];

    // if option is not provided, default to returning the initial value
    if (!option){
      options[key] = (owner) => owner;
      return;
    }

    // option is a factory function
    if (isFunction(option)){
      options[key] = option;
      return;
    }

    // option is an object, we need to handle each property directly
    if (isObject(option)){
      const optionKeys = Object.keys(option);
      const hasFactories = optionKeys.some((key) => isFunction(option[key]));

      // no factory functions, just merge the parent/child property
      if (!hasFactories){
        options[key] = (owner) => assign({}, owner, option);
        return;
      }

      options[key] = function(owner) {
        const result = assign({}, owner);
        const justBind = justBindFn(key);

        optionKeys.forEach((key) => {
          let value = option && option[key];

          if (isFunction(value)){
            // some properties expect functions
            if (justBind){
              value = value.bind(this);
            // for everything else, invoke the function to get the value
            }else{
              value = value.call(this, owner);
            }
          }
          result[key] = value;
        });
        return result;
      };
      return;
    }

    // for anything else, just return the option value
    options[key] = () => option;
  });

  return options;
};

// prepares the options so during render, we can quickly process them
const preprocessOptions = (originalOptions) => {
  const keys = getOptionsKeys(originalOptions);
  const options = createOptionHandlers(originalOptions, keys);

  return (context, isFunctional) => {
    const result = {
      on: {},
      props: {},
      attrs: {},
    };

    keys.forEach((key) => {
      // get this component's value
      const owner = isFunctional ?
        context[key] || context.data[key] :
        context[`$${key}`];

      // call the option handler
      const value = options[key].call(context, owner);

      // listeners has to be awkward and be renamed to on
      if (key === 'listeners'){
        key = 'on';
      }

      result[key] = value;
    });

    return result;
  };
};

// any unknown props need to be passed through as attrs
const getUnusedProps = (Component, props) => {
  const result = {};
  const target = getProps(Component);

  Object.keys(props).forEach((prop) => {
    if (target[prop] === undefined) {
      result[prop] = props[prop];
    }
  });

  return result;
};

const statelessRenderFn = (Component, getData, h, context) => {
  const data = getData(context, true);
  const scopedSlots = context.data.scopedSlots;
  const slots = context.children || [];
  const unusedProps = getUnusedProps(Component, data.props);

  data.scopedSlots = data.scopedSlots || scopedSlots;
  data.attrs = assign({}, unusedProps, data.attrs);

  return h(Component, data, slots);
};
const statefulRenderFn = (Component, getData, h, context) => {
  const data = getData(context, false);
  const scopedSlots = context.$scopedSlots;
  const slots = normalizeSlots(context.$slots, context.$vnode.context) || [];
  const unusedProps = getUnusedProps(Component, data.props);

  data.scopedSlots = data.scopedSlots || scopedSlots;
  data.attrs = assign({}, unusedProps, data.attrs);

  return h(Component, data, slots);
};

export const createRenderFn = (Component, options) => {
  const getData = preprocessOptions(options || {});

  return function renderHoc(h, context) {
    return context ?
      statelessRenderFn(Component, getData, h, context) :
      statefulRenderFn(Component, getData, h, this);
  };
};

export const createRenderFnc = (options) => {
  const curried = (Component) => createRenderFn(Component, options);
  curried[CURRIED] = true;
  return curried;
};
