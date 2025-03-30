import { Module } from 'vuex';

export type Topic = 'Mathematics' | 'English Language Arts' | 'Science' | 'History/Social Studies';

export interface BaseLessonPlan {
  title: string;
  description: string;
  gradeLevel: string;
  topic: Topic;
  timePerSession: number;
  occurrence: string;
  duration: string;
  sensorySupports?: string[];
  graphicSupports?: string[];
  interactiveSupports?: string[];
}

export interface BaseLessonPlanState {
  plan: BaseLessonPlan;
  activeFrameworks: string[];
}

export interface RootState {
  baseLessonPlan: BaseLessonPlanState;
  [key: string]: any;
}

// Type guards for validation
export const isValidTopic = (topic: any): topic is Topic => {
  return ['Mathematics', 'English Language Arts', 'Science', 'History/Social Studies'].includes(topic);
};

export const isValidBaseLessonPlan = (plan: any): plan is BaseLessonPlan => {
  return (
    typeof plan === 'object' &&
    plan !== null &&
    typeof plan.title === 'string' &&
    typeof plan.description === 'string' &&
    typeof plan.gradeLevel === 'string' &&
    plan.gradeLevel !== '' &&
    isValidTopic(plan.topic) &&
    typeof plan.timePerSession === 'number' &&
    plan.timePerSession > 0 &&
    typeof plan.occurrence === 'string' &&
    typeof plan.duration === 'string'
  );
};

const defaultState: BaseLessonPlanState = {
  plan: {
    title: '',
    description: '',
    gradeLevel: '',
    topic: 'Mathematics',
    timePerSession: 50,
    occurrence: '',
    duration: '',
    sensorySupports: [],
    graphicSupports: [],
    interactiveSupports: []
  },
  activeFrameworks: []
};

const baseLessonPlan: Module<BaseLessonPlanState, RootState> = {
  namespaced: true,

  state: { ...defaultState },

  mutations: {
    UPDATE_BASE_PLAN(state, payload: Partial<BaseLessonPlan>) {
      state.plan = {
        ...state.plan,
        ...payload
      };
    },

    SET_ACTIVE_FRAMEWORKS(state, frameworks: string[]) {
      state.activeFrameworks = frameworks;
    },

    RESET_STATE(state) {
      Object.assign(state, defaultState);
    }
  },

  actions: {
    updateBasePlan({ commit }, payload: Partial<BaseLessonPlan>) {
      // Validate individual fields before committing
      const validatedPayload: Partial<BaseLessonPlan> = {};
      
      if ('title' in payload && typeof payload.title === 'string') {
        validatedPayload.title = payload.title;
      }
      
      if ('description' in payload && typeof payload.description === 'string') {
        validatedPayload.description = payload.description;
      }

      if ('gradeLevel' in payload && typeof payload.gradeLevel === 'string') {
        validatedPayload.gradeLevel = payload.gradeLevel;
      }
      
      if ('topic' in payload && isValidTopic(payload.topic)) {
        validatedPayload.topic = payload.topic;
      }
      
      if ('timePerSession' in payload && 
          typeof payload.timePerSession === 'number' && 
          payload.timePerSession > 0) {
        validatedPayload.timePerSession = payload.timePerSession;
      }
      
      if ('occurrence' in payload && typeof payload.occurrence === 'string') {
        validatedPayload.occurrence = payload.occurrence;
      }
      
      if ('duration' in payload && typeof payload.duration === 'string') {
        validatedPayload.duration = payload.duration;
      }

      // Validate support arrays
      if ('sensorySupports' in payload && Array.isArray(payload.sensorySupports)) {
        validatedPayload.sensorySupports = payload.sensorySupports.filter(s => typeof s === 'string');
      }

      if ('graphicSupports' in payload && Array.isArray(payload.graphicSupports)) {
        validatedPayload.graphicSupports = payload.graphicSupports.filter(s => typeof s === 'string');
      }

      if ('interactiveSupports' in payload && Array.isArray(payload.interactiveSupports)) {
        validatedPayload.interactiveSupports = payload.interactiveSupports.filter(s => typeof s === 'string');
      }

      commit('UPDATE_BASE_PLAN', validatedPayload);
    },

    updatePlan({ commit }, payload: Partial<BaseLessonPlan>) {
      commit('UPDATE_BASE_PLAN', payload);
    },

    // Debug mode: Simplified framework activation
    async setActiveFrameworks({ commit }, frameworks: string[]) {
      commit('SET_ACTIVE_FRAMEWORKS', frameworks);
    },

    resetState({ commit, dispatch, state }) {
      // Reset all active frameworks first
      state.activeFrameworks.forEach(async framework => {
        try {
          await dispatch(`${framework}/resetState`, null, { root: true });
        } catch (err) {
          console.error(`Error resetting state for framework ${framework}:`, err);
        }
      });
      
      // Then reset base state
      commit('RESET_STATE');
    }
  },

  getters: {
    currentPlan: (state): BaseLessonPlan => state.plan,
    activeFrameworks: (state): string[] => state.activeFrameworks,
    isBaseFormValid: (state): boolean => {
      return isValidBaseLessonPlan(state.plan);
    }
  }
};

export default baseLessonPlan;
