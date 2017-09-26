// @flow
import type {
  NormalizeSlots,
} from './annotations';

const normalizeSlots: NormalizeSlots = (slots) => Object.keys(slots)
  .reduce((arr, key) => {
    slots[key].forEach(slot => {
      if (!slot.data) {
        slot.data = {};
      }
      slot.data.slot = key;
    });
    return arr.concat(slots[key]);
  }, []);

export default normalizeSlots;
