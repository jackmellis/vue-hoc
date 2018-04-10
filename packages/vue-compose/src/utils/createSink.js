const createSink = (fn) => {
  return {
    name: 'Sink',
    render(){
      fn.call(this, this.$attrs);
    },
  };
};

export default createSink;
