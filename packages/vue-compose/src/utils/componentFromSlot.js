import assign from '../utils/assign';

const componentFromSlot = (options = {}) => {
  return assign({
    name: 'ComponentFromSlot',
    render(){
      const props = assign({}, this.$attrs, this.$props );
      const listeners = this.$listeners || {};
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

      if (!vNode) {
        throw new Error('No slot content for ComponentFromSlot component');
      }

      const options = vNode.componentOptions || {};
      const listenerData = options.listeners = options.listeners || {};
      Object.keys(listeners).forEach((key) => {
        if (listenerData[key] == null) {
          listenerData[key] = listeners[key];
        } else if (Array.isArray(listenerData[key])) {
          listenerData[key].push(listeners[key]);
        } else {
          listenerData[key] = [ listenerData[key], listeners[key] ];
        }
      });

      return vNode;
    }
  }, options);
};

export default componentFromSlot;
