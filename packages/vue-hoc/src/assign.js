// IE9-11 do not support `Object.assign`
const poly = function (target, ...sources) {
  if (target == null) {
    throw new TypeError('Uncaught TypeError: Cannot convert undefined or null to object');
  }

  for (let i = 0, il = sources.length; i < il; i += 1) {
    const source = sources[i];
    if (source == null) {
      continue;
    }

    for (let key in source) {
      if (Object.hasOwnProperty.call(source, key)) {
        Object.defineProperty(target, key, {
          enumerable: true,
          writable: true,
          value: source[key],
        });
      }
    }
  }

  // $FlowFixMe
  return target;
};

const assign = Object.assign || poly;

export default assign;
