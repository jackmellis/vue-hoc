// IE9-11 do not support `Object.assign`
const assign = Object.assign || function (target, ...sources) {
  if (target == null) {
    throw new TypeError('Uncaught TypeError: Cannot convert undefined or null to object');
  }

  for (let i = 0, il = sources.length; i < il; i += 1) {
    const source = sources[i];
    if (source == null) {
      continue;
    }

    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

export default assign;
