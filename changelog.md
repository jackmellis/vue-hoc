# Change Log
## 0.3.0
- unknown render props are passed to the component as attributes

## 0.2.1
- allow slots to contain both elements and text nodes together

## 0.2.0
- `createHOCc` and `createRenderFnc` are now not *fully* curried methods, each takes configuration arguments and returns a function that accepts a component.
  ```js
  // 0.1:
  createHOCc(options)(renderWith)(Component)
  // or
  createHOCc(options, renderWith, Component)
  // must now be written as
  createHOCc(options, renderWith)(Component)
  ```

## 0.1.6
- Correctly handle scoped (template) slots [10](https://github.com/jackmellis/vue-hoc/pull/10)
