import type { Module } from 'vuex/types';

export interface AuthState {
  isAuthenticated: boolean;
  user: any;
}

const auth: Module<AuthState, any> = {
  namespaced: true,
  state: {
    isAuthenticated: false,
    user: null
  },
  mutations: {},
  actions: {},
  getters: {}
};

export default auth;