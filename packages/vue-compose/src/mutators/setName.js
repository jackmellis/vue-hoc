const setName = (name) => (ctor) => {
  const target = typeof ctor === 'function' ?
    ctor.options :
    ctor;

  target.name = name;

  return ctor;
};

export const getName = (ctor) => {
  const target = typeof ctor === 'function' ?
    ctor.options :
    ctor;

  return target.name || '';
};

export const wrapName = (name) => (ctor) => {
  const cname = getName(ctor) || 'Anonymous';
  return `${name}-${cname}`;
};

export default setName;
