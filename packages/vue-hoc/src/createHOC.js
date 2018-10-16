import { createRenderFnc } from './createRenderFn';
import getProps from './getProps';
import getComponentOptions from './getComponentOptions';
import Vue from 'vue';

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
    Object.keys(options).forEach((key) => {
      let child = options && options[key];
      const parent = hoc[key];
      const strategy = Vue.config.optionMergeStrategies[key] || defaultStrategy;

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

  if (hoc.render && hoc.render.curried){
    hoc.render = hoc.render(Component);
  }

  return hoc;
};

export const createHOCc = (
  options,
  renderOptions,
) => {
  const curried = (Component) => createHOC(Component, options, renderOptions);
  curried.curried = true;
  return curried;
};

export default createHOC;
