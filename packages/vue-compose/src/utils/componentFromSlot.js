import assign from '../utils/assign';

const componentFromSlot = (options = {}) => {
  return assign({
    name: 'ComponentFromSlot',
    render(){
      const props = assign({}, this.$attrs, this.$props );
      let vNode;

      if (this.$scopedSlots.children) {
        vNode = this.$scopedSlots.children(props);
      }
      if (this.$scopedSlots.default) {
        vNode = this.$scopeSlots.default(props)[0];
      }
      if (this.$slots.default) {
        const slot = this.$slots.default[0];
        const options = slot.componentOptions || {};
        const propsData = options.propsData = options.propsData || {};
        Object.assign(propsData, props);
        vNode = slot;
      }

      if (vNode) {
        return vNode;
      }

      throw new Error('No slot content for ComponentFromSlot component');
    }
  }, options);
};

export default componentFromSlot;
