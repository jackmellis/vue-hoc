import { withHooks } from 'vue-compose';

export default (namespace, store) => {
  if (typeof namespace === 'string') {
    namespace = namespace.split('/');
  }
  return withHooks({
    created () {
      let state = this.$store.state;
      let keys = [];

      namespace.forEach((key, i) => {
        keys.push(key);
        if (!state[key]) {
          if (i === namespace.length - 1) {
            this.$store.registerModule(keys, store);
          } else {
            this.$store.registerModule(keys, {});
          }
        }
        state = state[key];
      });
    },
  });
};
