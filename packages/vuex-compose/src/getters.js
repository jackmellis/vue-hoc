import { mapGetters } from 'vuex';
import {
  withProps,
  withComputed,
} from 'vue-compose';
import {
  createMapper,
} from './utils';

const mapper = createMapper(mapGetters);

export const mapGettersToProps = mapper(withProps);

export const mapGettersToComputed = mapper(withComputed);
