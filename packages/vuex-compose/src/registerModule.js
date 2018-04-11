import { withHooks } from 'vue-compose';

export default (namespace, store) => {
  if (typeof namespace === 'string') {
    namespace = namespace.split('/');
  }
  return withHooks({
    created () {
      const isRegistered = !!namespace.reduce((state, n) => {
        return state && state[n];
      }, this.$store.state);

      if (!isRegistered) {
        this.$store.registerModule(namespace, store);
      }
    },
  });
};
