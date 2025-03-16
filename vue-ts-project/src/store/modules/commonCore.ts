import { Module } from 'vuex';

export interface Standard {
  code: string;
  description: string;
}

export interface CommonCoreState {
  grade: string;
  strand: string;
  selectedStandards: Standard[];
  standardsAlignment: string;
  loading: boolean;
  error: string | null;
}

const defaultState: CommonCoreState = {
  grade: '',
  strand: '',
  selectedStandards: [],
  standardsAlignment: '',
  loading: false,
  error: null
};

const commonCore: Module<CommonCoreState, any> = {
  namespaced: true,

  state: { ...defaultState },

  mutations: {
    UPDATE_GRADE(state, grade: string) {
      state.grade = grade;
    },

    UPDATE_STRAND(state, strand: string) {
      state.strand = strand;
    },

    UPDATE_STANDARDS(state, standards: Standard[]) {
      state.selectedStandards = standards;
    },

    UPDATE_ALIGNMENT(state, alignment: string) {
      state.standardsAlignment = alignment;
    },

    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },

    SET_ERROR(state, error: string | null) {
      state.error = error;
    },

    RESET_STATE(state) {
      Object.assign(state, defaultState);
    }
  },

  actions: {
    updateGrade({ commit }, grade: string) {
      commit('UPDATE_GRADE', grade);
    },

    updateStrand({ commit }, strand: string) {
      commit('UPDATE_STRAND', strand);
    },

    updateStandards({ commit }, standards: Standard[]) {
      commit('UPDATE_STANDARDS', standards);
    },

    updateAlignment({ commit }, alignment: string) {
      commit('UPDATE_ALIGNMENT', alignment);
    },

    async resetState({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        commit('RESET_STATE');
        // Simulating async operation
        await new Promise(resolve => setTimeout(resolve, 100));
        commit('SET_LOADING', false);
      } catch (error) {
        commit('SET_ERROR', error instanceof Error ? error.message : 'An error occurred');
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    isValid: (state): boolean => {
      return !!(
        state.grade &&
        state.strand &&
        state.selectedStandards.length > 0
      );
    },

    getFrameworkData: (state): object => {
      const { loading, error, ...data } = state;
      return {
        framework: 'commonCore',
        data
      };
    },

    isLoading: (state): boolean => state.loading,
    hasError: (state): boolean => !!state.error,
    getError: (state): string | null => state.error
  }
};

export default commonCore;
