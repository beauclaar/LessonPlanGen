import { Module } from 'vuex';
import { RootState } from './baseLessonPlan';

export interface ProficiencyLevel {
  text: string;
  value: string;
}

export interface WIDAState {
  languageDomains: string[];
  proficiencyLevels: ProficiencyLevel[];
  contentObjective: string;
  gradeLevelCluster: string | null;
  widaStandards: string[];
  loading: boolean;
  error: string | null;
}

const defaultState: WIDAState = {
  languageDomains: [],
  proficiencyLevels: [],
  contentObjective: '',
  gradeLevelCluster: null,
  widaStandards: [],
  loading: false,
  error: null
};

const wida: Module<WIDAState, RootState> = {
  namespaced: true,

  state: { ...defaultState },

  mutations: {
    UPDATE_LANGUAGE_DOMAINS(state, domains: string[]) {
      state.languageDomains = domains;
    },

    UPDATE_PROFICIENCY_LEVELS(state, levels: ProficiencyLevel[]) {
      state.proficiencyLevels = levels;
    },

    UPDATE_CONTENT_OBJECTIVE(state, objective: string) {
      state.contentObjective = objective;
    },

    UPDATE_GRADE_LEVEL_CLUSTER(state, cluster: string) {
      state.gradeLevelCluster = cluster;
    },

    UPDATE_WIDA_STANDARDS(state, standards: string[]) {
      state.widaStandards = standards;
    },

    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },

    SET_ERROR(state, error: string | null) {
      state.error = error;
    },

    UPDATE_STATE(state, newState: Partial<WIDAState>) {
      Object.assign(state, { ...defaultState, ...newState });
    },

    RESET_STATE(state) {
      Object.assign(state, defaultState);
    }
  },

  actions: {
    updateLanguageDomains({ commit }, domains: string[]) {
      commit('UPDATE_LANGUAGE_DOMAINS', domains);
    },

    updateProficiencyLevels({ commit }, levels: ProficiencyLevel[]) {
      commit('UPDATE_PROFICIENCY_LEVELS', levels);
    },

    updateContentObjective({ commit }, objective: string) {
      commit('UPDATE_CONTENT_OBJECTIVE', objective);
    },

    updateGradeLevelCluster({ commit }, cluster: string) {
      commit('UPDATE_GRADE_LEVEL_CLUSTER', cluster);
    },

    updateWidaStandards({ commit }, standards: string[]) {
      commit('UPDATE_WIDA_STANDARDS', standards);
    },

    async resetState({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        // Simulating async operation with same timing as CommonCore
        await new Promise(resolve => setTimeout(resolve, 100));
        commit('RESET_STATE');
      } catch (error) {
        commit('SET_ERROR', error instanceof Error ? error.message : 'An error occurred');
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    isValid: (state): boolean => {
      return !!(
        state.languageDomains.length > 0 &&
        state.proficiencyLevels.length > 0 &&
        state.contentObjective.trim() &&
        state.gradeLevelCluster &&
        state.widaStandards.length > 0
      );
    },

    getFrameworkData: (state): object => {
      const { loading, error, ...data } = state;
      return {
        framework: 'wida',
        data
      };
    },

    isLoading: (state): boolean => state.loading,
    hasError: (state): boolean => !!state.error,
    getError: (state): string | null => state.error
  }
};

export default wida;
