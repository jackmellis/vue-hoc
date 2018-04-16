import { createHOC } from 'vue-hoc';
import { wrapName } from '../mutators/setName';

const provide = (provide) => (ctor) => {
  const hoc = createHOC(ctor, {
    provide,
  });
  hoc.name = wrapName('provide')(ctor);
  return hoc;
};

export default provide;
