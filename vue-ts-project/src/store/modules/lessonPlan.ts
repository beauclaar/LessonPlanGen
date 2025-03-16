import type { Module, ActionContext } from 'vuex/types';

export interface DailyFormativeAssessment {
  assessment: string;
  notes: string;
}

export interface SummativeAssessment {
  selectedAssessment: string;
  otherAssessment: string;
  notes: string;
}

export interface LessonPlan {
  title: string;
  gradeLevel: string;
  languageDomains: string[];
  proficiencyLevels: string[]; // Changed from number[] to string[]
  topic: string;
  duration: number;
  contentObjective: string;
  languageTarget: string;
  sensorySupports: string[];
  graphicSupports: string[];
  interactiveSupports: string[];
  activities: string[];
  formativeAssessments: DailyFormativeAssessment[];
  contentSummativeAssessment: SummativeAssessment;
  languageSummativeAssessment: SummativeAssessment;
  assessmentNotes: string;
}

export interface LessonPlanState {
  currentPlan: LessonPlan;
}

const defaultPlan: LessonPlan = {
  title: '',
  gradeLevel: '',
  languageDomains: [],
  proficiencyLevels: [], // Now will store strings like "Entering", "Emerging", etc.
  topic: '',
  duration: 0,
  contentObjective: '',
  languageTarget: '',
  sensorySupports: [],
  graphicSupports: [],
  interactiveSupports: [],
  activities: [],
  formativeAssessments: Array(5).fill({ assessment: '', notes: '' }),
  contentSummativeAssessment: { selectedAssessment: '', otherAssessment: '', notes: '' },
  languageSummativeAssessment: { selectedAssessment: '', otherAssessment: '', notes: '' },
  assessmentNotes: ''
};

const lessonPlan: Module<LessonPlanState, any> = {
  namespaced: true,
  
  state: {
    currentPlan: { ...defaultPlan }
  },

  mutations: {
    UPDATE_LESSON_PLAN(state, payload: Partial<LessonPlan>) {
      state.currentPlan = {
        ...state.currentPlan,
        ...payload
      };
    },

    RESET_LESSON_PLAN(state) {
      state.currentPlan = { ...defaultPlan };
    }
  },

  actions: {
    updateLessonPlan({ commit }, payload: Partial<LessonPlan>) {
      commit('UPDATE_LESSON_PLAN', payload);
    },

    resetLessonPlan({ commit }) {
      commit('RESET_LESSON_PLAN');
    }
  },

  getters: {
    currentLessonPlan: (state): LessonPlan => state.currentPlan,
    
    isLessonPlanValid: (state): boolean => {
      const plan = state.currentPlan;
      return !!(
        plan.title &&
        plan.gradeLevel &&
        plan.topic &&
        plan.duration &&
        plan.languageDomains.length > 0 &&
        plan.proficiencyLevels.length > 0 &&
        plan.contentObjective &&
        plan.languageTarget
      );
    }
  }
};

export default lessonPlan;