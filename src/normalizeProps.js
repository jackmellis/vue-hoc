import assign from './assign';

export default (props) => {
  if (!props){
    return {};
  }
  if (Array.isArray(props)){
    const obj = {};
    props.forEach((key) => {
      if (typeof key === 'string'){
        obj[key] = {};
      }
    });
    return obj;
  }
  return assign({}, props);
};
