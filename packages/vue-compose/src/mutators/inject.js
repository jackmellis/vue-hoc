const inject = (inject) => (ctor) => {
  const target = typeof ctor === 'function' ?
    ctor.options :
    ctor;

  target.mixins = (target.mixins || []).concat({
    inject,
  });

  return target;
};

export default inject;
