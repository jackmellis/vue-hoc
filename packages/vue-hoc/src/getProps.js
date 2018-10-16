import { assign, isArray } from './utils';
import getComponentOptions from './getComponentOptions';

const normalize = (props) => {
  if (!props) {
    return {};
  }
  if (isArray(props)) {
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

const mergeMixinProps = (mixins, initial = {}) => {
  if (!mixins || !mixins.length) {
    return initial;
  }

  return mixins.reduce((result, mixin) => {
    const props = assign(
      {},
      mergeMixinProps(mixin.mixins, result),
      normalize(mixin.props),
    );

    return assign({}, result, props);
  }, initial);
};

const getProps = (Component) => {
  const options = getComponentOptions(Component);
  const props = normalize(options.props);
  const mixinProps = mergeMixinProps(options.mixins);

  return assign({}, mixinProps, props);
};

export default getProps;
