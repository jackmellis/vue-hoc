import { createHOC } from 'vue-hoc';
import assign from '../utils/assign';
import { wrapName } from '../mutators/setName';

const withData = (data) => {
  const keys = Object.keys(data);
  const listeners = {};

  const dataCreator = function () {
    const result = {};
    keys.forEach(key => {
      const config = data[key];
      const { initialValue } = config;
      if (Object.hasOwnProperty.call(config, 'initialValue')){
        if (typeof initialValue === 'function'){
          result[key] = initialValue.call(this, this.$props);
        }else{
          result[key] = initialValue;
        }
      }else{
        result[key] = undefined;
      }
    });
    return result;
  };

  const propsCreator = function(ownerProps) {
    const result = assign({}, ownerProps);
    keys.forEach(key => {
      const propName = data[key].prop || key;
      result[propName] = this[key];
    });
    return result;
  };

  keys.forEach(key => {
    const listenerName = data[key].listener || key;

    listeners[listenerName] = data[key].handler || function(value){
      this[key] = value;
    };
  });

  return (ctor) => {
    const hoc = createHOC(ctor, {
      data: dataCreator,
      name: wrapName('withData')(ctor),
    }, {
      listeners,
      props: propsCreator,
    });

    keys.forEach(key => {
      if (hoc.props[key]){
        delete hoc.props[key];
      }
    });

    return hoc;
  };
};

export default withData;
