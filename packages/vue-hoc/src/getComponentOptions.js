export default (Component) => (typeof Component === 'function') ? Component.options : Component;
