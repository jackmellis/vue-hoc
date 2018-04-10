import assign from '../utils/assign';
import mapProps from './mapProps';
import { wrapName } from '../mutators/setName';

const defaultProps = (defaults) => (ctor) => {
  const keys = Object.keys(defaults);

  const hoc = mapProps((props) => {
    const result = assign({}, props);
    keys.forEach(key => {
      if (result[key] === undefined){
        result[key] = defaults[key];
      }
    });
    return result;
  })(ctor);
  hoc.name = wrapName('defaultProps')(ctor);
  keys.forEach((key) => {
    if (hoc.props[key] && hoc.props[key].required) {
      hoc.props[key] = assign(hoc.props[key], { required: false });
    }
  });
  return hoc;
};

export default defaultProps;
