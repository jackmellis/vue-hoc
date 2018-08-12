import withState from './mapStateToProps';
import {
  mapActionsToHandlers,
  mapActionCreatorsToHandlers,
} from './actions';
import {
  mapGettersToProps,
} from './getters';
import {
  compose,
} from 'vue-compose';
import {
  containsFunctions,
} from './utils';

const connect = (
  namespace,
  stateFn,
  dispatchFn,
  getterFn,
) => {
  if (typeof namespace !== 'string') {
    getterFn = dispatchFn;
    dispatchFn = stateFn;
    stateFn = namespace;
    namespace = '';
  }

  const args = [];

  if (stateFn != null) {
    args.push(withState(namespace, stateFn));
  }
  if (dispatchFn != null) {
    if (containsFunctions(dispatchFn)) {
      args.push(mapActionCreatorsToHandlers(namespace, dispatchFn));
    } else {
      args.push(mapActionsToHandlers(namespace, dispatchFn));
    }
  }
  if (getterFn != null) {
    args.push(mapGettersToProps(namespace, getterFn));
  }

  return compose.apply(null, args);
};

export default connect;
