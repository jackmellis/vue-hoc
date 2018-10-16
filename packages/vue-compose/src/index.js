import branch from './hocs/branch';
import mapProps from './hocs/mapProps';
import withProps from './hocs/withProps';
import defaultProps from './hocs/defaultProps';
import acceptProps from './hocs/acceptProps';
import withHandlers from './hocs/withHandlers';
import withNativeHandlers from './hocs/withNativeHandlers';
import withPassive from './hocs/withPassive';
import withHooks from './hocs/withHooks';
import withClass from './hocs/withClass';
import withStyle from './hocs/withStyle';
import withData from './hocs/withData';
import provide from './hocs/provide';

import withComputed from './mutators/withComputed';
import withMethods from './mutators/withMethods';
import setName from './mutators/setName';
import inject from './mutators/inject';

import createSink from './utils/createSink';
import componentFromProp from './utils/componentFromProp';
import componentFromSlot from './utils/componentFromSlot';
import renderNothing from './utils/renderNothing';
import { compose, pipe } from './utils/compose';

export {
  branch,
  mapProps,
  withProps,
  defaultProps,
  acceptProps,
  withHandlers,
  withNativeHandlers,
  withPassive,
  withHooks,
  withClass,
  withStyle,
  withData,
  provide,

  withComputed,
  withMethods,
  setName,
  inject,

  createSink,
  componentFromProp,
  componentFromSlot,
  renderNothing,
  compose,
  pipe,
};

export default {
  mapProps,
  withProps,
  defaultProps,
  acceptProps,
  withHandlers,
  withNativeHandlers,
  withPassive,
  withHooks,
  withClass,
  withStyle,
  withData,

  withComputed,
  withMethods,
  setName,

  createSink,
  componentFromProp,
  componentFromSlot,
  compose,
  pipe,
};
