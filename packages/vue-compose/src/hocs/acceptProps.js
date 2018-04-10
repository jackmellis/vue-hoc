import { createHOC } from 'vue-hoc';
import { wrapName } from '../mutators/setName';

export default (props) => {
  if (typeof props === 'string'){
    props = [props];
  }
  return (ctor) => createHOC(ctor, {
    props,
    name: wrapName('acceptProps')(ctor),
  });
};
