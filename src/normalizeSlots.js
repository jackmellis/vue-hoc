// @flow
import type {
  NormalizeSlots,
} from './annotations';

const normalizeSlots: NormalizeSlots = (slots, context) => Object.keys(slots)
  .reduce((arr, key) => {
    slots[key].forEach(vnode => {
      if (!vnode.data) {
        vnode.data = {};
      }
      vnode.data.slot = key;

      if (!vnode.context) {
        vnode.context = context;
      }
    });
    return arr.concat(slots[key]);
  }, []);

export default normalizeSlots;
