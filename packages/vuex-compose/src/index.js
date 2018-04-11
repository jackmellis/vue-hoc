import { compose } from 'vue-compose';

import registerModule from './registerModule';
import mapStateToProps from './mapStateToProps';
import {
  mapGettersToProps,
  mapGettersToComputed,
} from './getters';
import {
  mapMutationsToHandlers,
} from './mutations';
import {
  mapActionsToHandlers,
  mapActionsToMethods,
  mapActionsToProps,
  mapActionCreatorsToProps,
  mapActionCreatorsToMethods,
  mapActionCreatorsToHandlers,
} from './actions';

export {
  compose,
  registerModule,
  mapStateToProps as withState,
  mapStateToProps,
  mapGettersToProps as withGetters,
  mapGettersToProps,
  mapGettersToComputed,
  mapMutationsToHandlers as withMutations,
  mapMutationsToHandlers,
  mapActionsToHandlers as withActions,
  mapActionsToHandlers,
  mapActionsToMethods,
  mapActionsToProps,
  mapActionCreatorsToHandlers as withActionCreators,
  mapActionCreatorsToProps,
  mapActionCreatorsToMethods,
  mapActionCreatorsToHandlers,
};
