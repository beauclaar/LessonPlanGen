import { Module } from 'vuex';

export interface CoreIdea {
  code: string;
  description: string;
}

export interface NextGenScienceState {
  gradeLevel: string;
  scienceDomain: string;
  disciplinaryCoreIdeas: CoreIdea[];
  sciencePractices: string[];
  crossCuttingConcepts: string[];
  performanceExpectations: string;
}

const defaultState: NextGenScienceState = {
  gradeLevel: '',
  scienceDomain: '',
  disciplinaryCoreIdeas: [],
  sciencePractices: [],
  crossCuttingConcepts: [],
  performanceExpectations: ''
};

const nextGenScience: Module<NextGenScienceState, any> = {
  namespaced: true,

  state: { ...defaultState },

  mutations: {
    UPDATE_GRADE_LEVEL(state, level: string) {
      state.gradeLevel = level;
    },

    UPDATE_DOMAIN(state, domain: string) {
      state.scienceDomain = domain;
    },

    UPDATE_CORE_IDEAS(state, ideas: CoreIdea[]) {
      state.disciplinaryCoreIdeas = ideas;
    },

    UPDATE_PRACTICES(state, practices: string[]) {
      state.sciencePractices = practices;
    },

    UPDATE_CROSSCUTTING(state, concepts: string[]) {
      state.crossCuttingConcepts = concepts;
    },

    UPDATE_EXPECTATIONS(state, expectations: string) {
      state.performanceExpectations = expectations;
    },

    RESET_STATE(state) {
      Object.assign(state, defaultState);
    }
  },

  actions: {
    updateGradeLevel({ commit }, level: string) {
      commit('UPDATE_GRADE_LEVEL', level);
    },

    updateDomain({ commit }, domain: string) {
      commit('UPDATE_DOMAIN', domain);
    },

    updateCoreIdeas({ commit }, ideas: CoreIdea[]) {
      commit('UPDATE_CORE_IDEAS', ideas);
    },

    updatePractices({ commit }, practices: string[]) {
      commit('UPDATE_PRACTICES', practices);
    },

    updateCrossCutting({ commit }, concepts: string[]) {
      commit('UPDATE_CROSSCUTTING', concepts);
    },

    updateExpectations({ commit }, expectations: string) {
      commit('UPDATE_EXPECTATIONS', expectations);
    },

    resetState({ commit }) {
      commit('RESET_STATE');
    }
  },

  getters: {
    isValid: (state): boolean => {
      return !!(
        state.gradeLevel &&
        state.scienceDomain &&
        state.disciplinaryCoreIdeas.length > 0 &&
        state.sciencePractices.length > 0 &&
        state.crossCuttingConcepts.length > 0 &&
        state.performanceExpectations
      );
    },

    getFrameworkData: (state): object => {
      return {
        framework: 'nextGenScience',
        data: { ...state }
      };
    }
  }
};

export default nextGenScience;
