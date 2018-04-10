import test from 'ava';
import {mount, mockStore} from 'vuenit';
import {
  compose,
  withProps,
  withHandlers,
} from 'vue-compose';
import Vue from 'vue';
import vuex, { mapState, mapActions, mapGetters } from 'vuex';

Vue.use(vuex);

const C = {
  props: ['name'],
  methods: {
    handleChange(evt){
      this.$emit('changeName', evt.target.value);
    },
  },
  template: '<div><input :value="name" @change="handleChange"></div>'
};

const store = new vuex.Store({
  modules: {
    users: {
      namespaced: true,
      state: {
        user: {
          name: 'jim'
        }
      },
      getters: {
        userName(state){
          return state.user.name;
        }
      },
      mutations: {
        CHANGE_NAME(state, value){
          state.user.name = value;
        }
      },
      actions: {
        changeName({commit}, value){
          commit('CHANGE_NAME', value);
        }
      }
    }
  }
});
Vue.prototype.$store = store;

mount(C);

const enhance = compose(
  withProps(mapGetters('users', {
    name: 'userName'
  })),
  withHandlers(mapActions('users', ['changeName'])),
);


test('it works with vuex', t => {
  const enhanced = enhance(C);
  const vm = mount(enhanced);

  const input = vm.$findOne('input');
  t.is(input.value, 'jim');

  input.value = 'bob';
  input.$trigger('change');

  t.is(store.state.users.user.name, 'bob');
});
