function isTextNode(node) {
  return node != null && node.text != null && node.isComment === false;
}

const normalizeSlots = (slots, context) => Object.keys(slots)
  .reduce((arr, key) => {
    slots[key].forEach(vnode => {
      if (!vnode.context) {
        if (isTextNode(vnode)) {
          slots[key] = context.$createElement('template', {slot: key}, [vnode]);
        } else {
          slots[key].context = context;

          if (!vnode.data) {
            vnode.data = {};
          }
          vnode.data.slot = key;
        }
      }
    });
    return arr.concat(slots[key]);
  }, []);

export default normalizeSlots;
