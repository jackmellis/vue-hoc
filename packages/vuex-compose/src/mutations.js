import { mapMutations } from 'vuex';
import {
  withHandlers
} from 'vue-compose';
import {
  createMapper,
} from './utils';

const mapper = createMapper(mapMutations);

export const mapMutationsToHandlers = mapper(withHandlers);
