export const createMapper = (vuexMethod) => (composer) => (namespace, map) => {
  const method = vuexMethod(namespace, map);

  return composer(
    method,
  );
};
