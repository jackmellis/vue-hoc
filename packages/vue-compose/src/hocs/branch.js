import { createHOC, createRenderFn } from 'vue-hoc';
import { wrapName } from '../mutators/setName';

export default (testFn, trueFn, falseFn) => (ctor) => {
  if (falseFn == null) {
    falseFn = createRenderFn(ctor);
  }
  if (typeof falseFn === 'object' && typeof falseFn.render === 'function') {
    falseFn = falseFn.render;
  }
  if (typeof trueFn === 'object' && typeof trueFn.render === 'function') {
    trueFn = trueFn.render;
  }

  return createHOC(ctor, {
    name: wrapName('branch')(ctor),
    render (h) {
      if (testFn.call(this, this.$props)) {
        return trueFn.call(this, h);
      } else {
        return falseFn.call(this, h);
      }
    },
  });
};
