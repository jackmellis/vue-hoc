// deprecated
function createFn(fn, args, totalArity){
  const curried = (...partialArgs) => {
    return processInvocation.call(this, fn, args.concat(partialArgs), totalArity);
  };
  curried.curried = true;
  return curried;
}

function processInvocation(fn, args, totalArity){
  if (args.length === totalArity){
    return fn.apply(this, args);
  }else{
    return createFn(fn, args, totalArity);
  }
}

const courier = (count, fn) => {
  return createFn(fn, [], count);
};

export default courier;
