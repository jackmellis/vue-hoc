import { createRenderFn } from 'vue-hoc';

const componentFromProp = (propName) => {
  return {
    name: 'ComponentFromProp',
    props: {
      [propName]: {
        type: [String, Object, Function],
        required: true
      }
    },
    render(h){
      const C = this[propName];
      return createRenderFn(C).call(this, h);
    }
  };
};

export default componentFromProp;
