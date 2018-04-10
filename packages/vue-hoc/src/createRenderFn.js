import normalizeSlots from './normalizeSlots';
import normalizeProps from './normalizeProps';
import assign from './assign';

const isObject = test => Object.prototype.toString.call(test) === '[object Object]';

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
  const options = {};

  keys.forEach(key => {
    const option = originalOptions[key];

    if (!option){
      options[key] = owner => owner;
      return;
    }

    if (typeof option === 'function'){
      options[key] = option;
      return;
    }

    if (typeof option === 'object' && isObject(option)){
      const optionKeys = Object.keys(option);

      if (!optionKeys.some(k => typeof option[k] === 'function')){
        options[key] = (owner) => assign({}, owner, option);
        return;
      }

      options[key] = function(owner) {
        const result = assign({}, owner);
        const justBind = justBindFn(key);

        optionKeys.forEach(k => {
          let value = option && option[k];

          if (typeof value === 'function'){
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
    const result = {
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

const getUnusedProps = (Component, props) => {
  const result = {};
  const target = normalizeProps((typeof Component === 'function') ? Component.options.props : Component.props);

  Object.keys(props).forEach((prop) => {
    if (target[prop] === undefined) {
      result[prop] = props[prop];
    }
  });

  return result;
};


export const createRenderFn = (Component, options) => {
  const getData = preprocessOptions(options || {});

  return function renderHoc(h, context) {
    const data = getData(context || this, !!context);
    const scopedSlots = (context && context.data && context.data.scopedSlots) ||
                        (this && this.$scopedSlots);
    const slots = (context && context.children) || (this && this.$slots && normalizeSlots(this.$slots, this.$parent)) || [];
    const unusedProps = getUnusedProps(Component, data.props);

    data.scopedSlots = data.scopedSlots || scopedSlots;
    data.attrs = assign({}, unusedProps, data.attrs);

    return h(Component, data, slots);
  };
};

export const createRenderFnc = (options) => {
  const curried = (Component) => createRenderFn(Component, options);
  curried.curried = true;
  return curried;
};
