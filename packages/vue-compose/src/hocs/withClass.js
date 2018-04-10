import { createHOC } from 'vue-hoc';
import { wrapName } from '../mutators/setName';

export default (classes) => (ctor) => {
  return createHOC(ctor, {
    name: wrapName('withClass')(ctor),
  }, {
    class: classes,
  });
};
