// @flow
export type CompnentDefinition = {
  props?: Array<string> | Object,
  name?: string,
  mixins?: Array<Object>,
  render?: Function,
};
export type Ctor = CompnentDefinition | Function;

type Listeners = {
  [eventName: string]: Function
};
export type CreateRenderFnOptions = {
  attrs?: Object | (attrs: Object) => Object,
  props?: Object | (props: Object) => Object,
  listeners?: Listeners | (listeners: Listeners) => Listeners,
};
export type CreateRenderFn = (Component: Ctor, options?: CreateRenderFnOptions) => Function;
export type CreateRenderFnc = (options?: CreateRenderFnOptions, Component?: Ctor) => Function;


export type CreateHOCOptions = CompnentDefinition;
export type CreateHOC = (
  Component: Ctor,
  options?: CreateHOCOptions,
  renderOptions?: CreateRenderFnOptions
) => Ctor;
export type CreateHOCc = (
  options?: CreateHOCOptions,
  renderOptions?: CreateRenderFnOptions,
  Component?: Ctor,
) => Ctor | Function;

export type NormalizeSlots = (slots: Object) => Array<Object>;
