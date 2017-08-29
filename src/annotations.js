// @flow
export type CompnentDefinition = {
  props?: Array<string> | Object,
  name?: string,
  mixins?: Array<Object>,
  render?: Function,
};
export type Ctor = CompnentDefinition | Function;

export type NormalizeSlots = (slots: Object) => Array<Object>;

type RenderFnOption = {
  [name: string]: Function,
} | (owner: Object) => RenderFnOption;

export type CreateRenderFnOptions = {
  attrs?: RenderFnOption,
  props?: RenderFnOption,
  listeners?: RenderFnOption,
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
