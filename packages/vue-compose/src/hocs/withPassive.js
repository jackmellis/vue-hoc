import withHandlers from './withHandlers';
import { wrapName } from '../mutators/setName';

const withPassive = (passives) => {
  const handlers = {};
  Object.keys(passives).forEach(key => {
    handlers[key] = function (...args) {
      passives[key].apply(this, args);
      this.$emit.apply(this, [key].concat(args));
    };
  });

  return (ctor) => {
    const hoc = withHandlers(handlers)(ctor);
    hoc.name = wrapName('withPassive')(ctor);

    return hoc;
  };
};

export default withPassive;
