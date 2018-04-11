import { withProps } from 'vue-compose';

const mapStateToProps = (namespace, map) => {
  if (typeof namespace !== 'string') {
    map = namespace;
    namespace = '';
  }
  namespace = namespace ? namespace.split('/') : [];

  const getState = (store) => {
    return namespace.reduce((state, n) => {
      return state && state[n];
    }, store.state);
  };

  const mapped = {};

  if (Array.isArray(map)) {
    map.forEach(key => {
      mapped[key] = function(){
        const state = getState(this.$store);
        return state[key];
      };
    });
  } else {
    Object.keys(map).forEach(key => {
      const value = map[key];

      switch (typeof value){
      case 'string':
        mapped[key] = function () {
          const state = getState(this.$store);
          return state[value];
        };
        break;
      case 'function':
        mapped[key] = function () {
          const state = getState(this.$store);
          return value.call(this, state);
        };
        break;
      default:
        throw new Error(`Invalid type ${Object.prototype.toString.call(value)} for withState`);
      }
    });
  }

  return withProps(mapped);
};

export default mapStateToProps;
