import Vue from "vue";
import Vuex from "vuex";

import Servicios from "./Servicios";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
export default new Vuex.Store({
  modules: {
    Servicios
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV,
  state: {
    token: localStorage.getItem("token") || null,
    baseURL: "/api/manage",
    user: {}
  },
  mutations: {
    SET_USER(state, value) {
      state.user = value;
    },
    SET_TOKEN(state, value) {
      state.token = value;
    }
  }
});
