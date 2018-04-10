import assign from '../utils/assign';
import { createHOC } from 'vue-hoc';
import mapProps from './mapProps';
import { wrapName } from '../mutators/setName';

const withPropsFn = (ctor, mapper) => {
  return  mapProps(function (props) {
    const mapped = mapper.call(this, props);
    return assign({}, props, mapped);
  })(ctor);
};

const withComputedProps = (ctor, keys, allProps) => {
  const computed = {};
  const props = {};
  keys.forEach(key => {
    let value = allProps[key];
    if (typeof value === 'function'){
      const computedName = `computed_${key}`;
      computed[computedName] = value;
      value = function(){
        return this[computedName];
      };
    }
    props[key] = value;
  });
  const hoc = createHOC(ctor, { computed }, { props });
  keys.forEach((key) => {
    if (hoc.props[key] && hoc.props[key].required) {
      hoc.props[key] = assign(hoc.props[key], { required: false });
    }
  });
  return hoc;
};

const withStaticProps = (ctor, props) => {
  const hoc =  createHOC(ctor, null, { props });
  Object.keys(props).forEach((key) => {
    if (hoc.props[key] && hoc.props[key].required) {
      hoc.props[key] = assign(hoc.props[key], { required: false });
    }
  });
  return hoc;
};

const getHoc = (mapper, ctor) => {
  if (typeof mapper === 'function'){
    return withPropsFn(ctor, mapper);
  }
  const keys = Object.keys(mapper);
  if (keys.some(key => typeof mapper[key] === 'function')){
    return withComputedProps(ctor, keys, mapper);
  }
  return withStaticProps(ctor, mapper);
};

const withProps = (mapper) => (ctor) => {
  const hoc = getHoc(mapper, ctor);
  hoc.name = wrapName('withProps')(ctor);
  return hoc;
};

export default withProps;
