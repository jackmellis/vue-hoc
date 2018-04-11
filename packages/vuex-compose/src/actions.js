import { mapActions } from 'vuex';
import {
  compose,
  withHandlers,
  withMethods,
  withProps,
} from 'vue-compose';
import {
  createMapper,
} from './utils';

const mapper = createMapper(mapActions);

export const mapActionsToHandlers = mapper(withHandlers);

export const mapActionsToMethods = mapper(withMethods);

// export const mapActionsToProps = mapper(withProps);
export const mapActionsToProps = (namespace, map) => compose(
  mapActionsToMethods(namespace, map),
  withProps(function () {
    const props = {};
    Object.keys(this.$options.methods).forEach((key) => {
      props[key] = this[key];
    });
    return props;
  }),
);

const creatorMapper = (method) => (creators) => {
  const handlers = {};

  Object.keys(creators).forEach((key) => {
    const creator = creators[key];
    handlers[key] = function () {
      const args = Array.prototype.slice.call(arguments);
      const action = creator.apply(null, args);

      return this.$store.dispatch(action);
    };
  });

  return method(handlers);
};

export const mapActionCreatorsToHandlers = creatorMapper(withHandlers);

export const mapActionCreatorsToMethods = creatorMapper(withMethods);

export const mapActionCreatorsToProps = (creators) => compose(
  mapActionCreatorsToMethods(creators),
  withProps(function () {
    const props = {};
    Object.keys(this.$options.methods).forEach((key) => {
      props[key] = this[key];
    });
    return props;
  }),
);
