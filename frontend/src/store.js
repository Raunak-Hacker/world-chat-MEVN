import { createStore } from "vuex";

const store = createStore({
  state: {
    close: true,
  },
  actions: {},
  mutations: {
    toggle(state, payload) {
      if (payload) {
        state.close = payload;
      } else {
        state.close = !state.close;
      }
    },
  },
  getters: {},
});

export default store;
