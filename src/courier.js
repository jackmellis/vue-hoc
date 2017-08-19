// @flow
function createFn(fn, args, totalArity){
  const curried = (...partialArgs) => {
    return processInvocation.call(this, fn, args.concat(partialArgs), totalArity);
  };
  curried.curried = true;
  return curried;
}

function processInvocation(fn, args, totalArity){
  const remainingArity = totalArity - args.length;
  if (args.length === totalArity){
    return fn.apply(this, args);
  }else{
    return createFn(fn, args, totalArity);
  }
}

export default (
  count: number,
  fn: Function,
): Function => {
    return createFn(fn, [], count);
};
