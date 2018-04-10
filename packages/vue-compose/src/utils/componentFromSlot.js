import assign from '../utils/assign';

const componentFromSlot = (options = {}) => {
  return assign({
    name: 'ComponentFromSlot',
    render(h){
      const children = this.$slots.default; //children;
      if (children.length !== 1){
        throw new Error('ComponentFromSlot must be used with only 1 root element');
      }

      const slot = children[0];
      const tag = slot.tag;
      const data = assign({}, this, slot.data);

      if (typeof tag !== 'string'){
        throw new Error('The root element of ComponentFromSlot must be a HTML element');
      }

      return h(tag, data, slot.children);
    }
  }, options);
};

export default componentFromSlot;
