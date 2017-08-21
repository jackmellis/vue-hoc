// @flow
import type {
  NormalizeSlots,
} from './annotations';

const normalizeSlots: NormalizeSlots = (slots) => Object.keys(slots)
  .reduce((arr, key) => arr.concat(slots[key]), []);

export default normalizeSlots;
