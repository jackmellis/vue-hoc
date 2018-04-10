import { createHOC } from 'vue-hoc';
import { wrapName } from '../mutators/setName';

export default (mapper) => {
  const options = {
    computed: {
      mapProps(){
        return mapper.call(this, this.$props);
      }
    },
  };
  const renderWith = {
    props(){
      return this.mapProps;
    }
  };
  return (ctor) => {
    const hoc = createHOC(ctor, options, renderWith);
    hoc.name = wrapName('mapProps')(hoc);
    return hoc;
  };
};
