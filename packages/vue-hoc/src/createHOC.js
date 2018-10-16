import Vue from 'vue';
import { createRenderFnc } from './createRenderFn';
import getProps from './getProps';
import getComponentOptions from './getComponentOptions';
import { CURRIED } from './constants';

const defaultStrategy = (parent, child) => child;

export const createHOC = (Component, options, renderOptions) => {
  const target = getComponentOptions(Component);

  const hoc = {
    props: getProps(target),
    mixins: [],
    name: `${target.name || 'Anonymous'}HOC`,
    render: createRenderFnc(renderOptions),
  };

  if (options){
    // merge options into the hoc
    // we piggyback off Vue's optionMergeStrategies so we get the same
    // merging behavior as with mixins
    Object.keys(options).forEach((key) => {
      let child = options && options[key];
      const parent = hoc[key];
      const strategy = Vue.config.optionMergeStrategies[key] || defaultStrategy;

      // props are unique as we have a specific normaliser
      if (key === 'props') {
        child = getProps(options);
      }

      hoc[key] = strategy(parent, child);
    });
  }

  hoc.mixins && hoc.mixins.push({
    created(){
      this.$createElement = this.$vnode.context.$createElement;
      this._c = this.$vnode.context._c;
    }
  });

  if (hoc.render && hoc.render[CURRIED]){
    hoc.render = hoc.render(Component);
  }

  return hoc;
};

export const createHOCc = (
  options,
  renderOptions,
) => {
  const curried = (Component) => createHOC(Component, options, renderOptions);
  curried[CURRIED] = true;
  return curried;
};

export default createHOC;
