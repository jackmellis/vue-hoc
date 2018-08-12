export const createMapper = (vuexMethod) => (composer) => (namespace, map) => {
  const method = vuexMethod(namespace, map);

  return composer(
    method,
  );
};

export const containsFunctions = (obj) => {
  if (typeof obj !== 'object') {
    return false;
  }
  const keys = Object.keys(obj);
  const t = typeof obj[keys[0]];

  return t === 'function';
};
