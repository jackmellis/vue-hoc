import { createHOC } from 'vue-hoc';
import { wrapName } from '../mutators/setName';

const withHooks = (hooks) => (ctor) => {
  const definiteHooks = {
    name: wrapName('withHooks')(ctor),
  };
  Object.keys(hooks).forEach(key => {
    const value = hooks[key];
    if (typeof value === 'function'){
      definiteHooks[key] = value;
    }
  });
  return createHOC(ctor, definiteHooks);
};

export default withHooks;
