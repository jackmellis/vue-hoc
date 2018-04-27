import assign from './assign';
import getComponentOptions from './getComponentOptions';

const normalize = (props) => {
  if (!props) {
    return {};
  }
  if (Array.isArray(props)) {
    const result = {};
    props.forEach((key) => {
      if (typeof key === 'string') {
        result[key] = {};
      }
    });
    return result;
  }
  return assign({}, props);
};

export default (Component) => {
  const options = getComponentOptions(Component);
  const props = normalize(options.props);
  const mixins = options.mixins || [];

  return mixins.reduce((result, mixin) => {
    if (!mixin.props) {
      return result;
    }
    return assign({}, result, normalize(mixin.props));
  }, props);
};
