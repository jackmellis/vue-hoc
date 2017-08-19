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

export const createHOC: CreateHOC = (Component, options, renderOptions) => {
  options = options || {};
  const hoc: Ctor = Object.assign({
    functional: false,
    props: (typeof Component === 'function')
      ? Component.options.props
      : Component.props,
    mixins: [],
    name: (Component.name || 'Annonymous') + 'HOC',
    render: createRenderFnc(renderOptions),
  }, options);

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
