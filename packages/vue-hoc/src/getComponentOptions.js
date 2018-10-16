import { isFunction } from './utils';

export default (Component) => (isFunction(Component)) ? Component.options : Component;
