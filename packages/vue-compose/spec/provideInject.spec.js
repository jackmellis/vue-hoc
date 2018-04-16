import test from 'ava';
import {
  provide,
  inject,
  createSink,
} from 'vue-compose';
import { mount } from 'vuenit';

test('provides and injects values', t => {
  const Child = inject(['thingy'])(createSink(assertions));
  // const Child = {
  //   inject: ['thingy'],
  //   render: assertions
  // };
  const Middle = {
    components: { Child },
    // template: '<div><Child/></div>',
    render: function anonymous() {
      return this._c('div',[this._c('Child')],1);
    },
  };

  const PureParent = {
    // provide: () => ({ thingy: 'floogle' }),
    // provide: {
    //   thingy: 'floogle',
    // },
    components: { Middle },
    // template: '<div><Middle/></div>',
    render: function anonymous() {
      return this._c('div',[this._c('Middle')],1);
    }
  };

  const Parent = provide(() => {
    return {
      thingy: 'floogle',
    };
  })(PureParent);
  // const Parent = PureParent;

  mount(Parent);

  function assertions(){
    t.is(this.thingy, 'floogle');
  }
});
