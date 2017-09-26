// @flow
import type {
  Ctor,
  CreateRenderFnOptions,
  CreateHOCOptions,
  CreateHOC,
  CreateHOCc,
} from './annotations';

import courier from './courier';
import {createRenderFnc} from './createRenderFn';
import assign from './assign';
import Vue from 'vue';

const defaultStrategy = (parent, child) => child;

const normalizeProps = (props: Object | Array<string> | void) => {
  if (!props){
    return {};
  }
  if (Array.isArray(props)){
    const obj = {};
    props.forEach((key) => {
      if (typeof key === 'string'){
        obj[key] = {};
      }
    });
    return obj;
  }
  return assign({}, props);
};

export const createHOC: CreateHOC = (Component, options, renderOptions) => {
  const hoc: Ctor = {
    props: normalizeProps((typeof Component === 'function')
      ? Component.options.props
      : Component.props),
    mixins: [],
    name: `${Component.name || 'Anonymous'}HOC`,
    render: createRenderFnc(renderOptions),
  };
  if (options){
    Object.keys(options).forEach((key) => {
      const child = options && options[key];
      const parent = hoc[key];
      const strategy: Function = Vue.config.optionMergeStrategies[key] || defaultStrategy;

      if (key === 'props'){

        // $FlowFixMe
        hoc[key] = strategy(parent, normalizeProps(child));
      }else{
        hoc[key] = strategy(parent, child);
      }
    });
  }

  hoc.mixins && hoc.mixins.push({
    created(){
      this.$createElement = this.$parent.$createElement;
    }
  });

  if (hoc.render && hoc.render.curried){
    hoc.render = hoc.render(Component);
  }

  return hoc;
};

export const createHOCc: CreateHOCc = courier(3, (
  options: CreateHOCOptions,
  renderOptions: CreateRenderFnOptions,
  Component: Ctor
) => {
  return createHOC(Component, options, renderOptions);
});

export default createHOC;
