export const pipe = (...args) => (Component) => args.reduce((result, fn) => fn(result), Component);

export const compose = (...args) => pipe.apply(null, args.reverse());
