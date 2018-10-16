import { createHOC } from 'vue-hoc';
import { wrapName } from '../mutators/setName';

const withNativeHandlers = (handlers) => {
  const listeners = {};
  const methods = {};

  Object.keys(handlers).forEach(key => {
    const methodName = `handle${key.charAt(0).toUpperCase()}${key.substr(1)}`;
    methods[methodName] = handlers[key];
    listeners[key] = function () {
      return this[methodName].apply(this, arguments);
    };
  });

  return (ctor) => createHOC(ctor, {
    name: wrapName('withNativeHandlers')(ctor),
    methods,
  }, {
    nativeOn: listeners,
  });
};

export default withNativeHandlers;
