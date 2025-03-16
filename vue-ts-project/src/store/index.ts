import { createStore, Store } from 'vuex';
import { BaseLessonPlan } from './modules/baseLessonPlan';
import { CommonCoreState } from './modules/commonCore';
import { NextGenScienceState } from './modules/nextGenScience';
import { WIDAState } from './modules/wida';
import baseLessonPlan from './modules/baseLessonPlan';
import commonCore from './modules/commonCore';
import nextGenScience from './modules/nextGenScience';
import wida from './modules/wida';
import exportUtils from './modules/exportUtils';

// State persistence utilities
const STORAGE_KEY = 'lesson-plan-state';

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

const loadState = (): Partial<RootState> | undefined => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

export interface RootState {
  baseLessonPlan: {
    plan: BaseLessonPlan;
    activeFrameworks: string[];
  };
  commonCore: CommonCoreState;
  nextGenScience: NextGenScienceState;
  wida: WIDAState;
  exportUtils: {
    isExporting: boolean;
    exportError: string | null;
  };
}

// Load persisted state
const persistedState = loadState();

// Create store with persistence
const store = createStore<RootState>({
  modules: {
    baseLessonPlan,
    commonCore,
    nextGenScience,
    wida,
    exportUtils
  },

  // Root state mutations and actions for cross-module operations
  mutations: {
    RESET_ALL_STATES(state: RootState) {
      // Mutation only receives state, moving commit logic to action
    }
  },

  actions: {
    resetAllStates({ commit }) {
      // Reset each namespaced module using their own reset mutations
      commit('baseLessonPlan/RESET_STATE', null, { root: true });
      commit('commonCore/RESET_STATE', null, { root: true });
      commit('nextGenScience/RESET_STATE', null, { root: true });
      commit('wida/RESET_STATE', null, { root: true });
      commit('RESET_ALL_STATES');
      // Clear persisted state when resetting
      localStorage.removeItem(STORAGE_KEY);
    },

    async exportLessonPlan({ state }): Promise<object> {
      // Collect all data from active frameworks
      const frameworkData = state.baseLessonPlan.activeFrameworks.map(framework => {
        switch (framework) {
          case 'commonCore':
            return {
              framework: 'commonCore',
              data: { ...state.commonCore }
            };
          case 'nextGenScience':
            return {
              framework: 'nextGenScience',
              data: { ...state.nextGenScience }
            };
          case 'wida':
            return {
              framework: 'wida',
              data: { ...state.wida }
            };
          default:
            return null;
        }
      }).filter(data => data !== null);

      return {
        basePlan: state.baseLessonPlan.plan,
        frameworks: frameworkData
      };
    },

    async importLessonPlan({ commit }, data: any) {
      commit('RESET_ALL_STATES');
      
      if (data.basePlan) {
        commit('baseLessonPlan/UPDATE_BASE_PLAN', data.basePlan);
      }

      if (data.frameworks) {
        const frameworks = data.frameworks.map((f: any) => f.framework);
        commit('baseLessonPlan/SET_ACTIVE_FRAMEWORKS', frameworks);

        data.frameworks.forEach((framework: any) => {
          switch (framework.framework) {
            case 'commonCore':
              Object.entries(framework.data).forEach(([key, value]) => {
                commit(`commonCore/UPDATE_${key.toUpperCase()}`, value);
              });
              break;
            case 'nextGenScience':
              Object.entries(framework.data).forEach(([key, value]) => {
                commit(`nextGenScience/UPDATE_${key.toUpperCase()}`, value);
              });
              break;
            case 'wida':
              commit('wida/UPDATE_STATE', framework.data);
              break;
          }
        });
      }
    }
  },

  getters: {
    isAnyFrameworkActive: (state) => state.baseLessonPlan.activeFrameworks.length > 0,
    
    isLessonPlanValid: (state, getters) => {
      // Check if base plan is valid
      if (!getters['baseLessonPlan/isBaseFormValid']) {
        return false;
      }

      // Check if active frameworks are valid
      return state.baseLessonPlan.activeFrameworks.every(framework => {
        switch (framework) {
          case 'commonCore':
            return getters['commonCore/isValid'];
          case 'nextGenScience':
            return getters['nextGenScience/isValid'];
          case 'wida':
            return getters['wida/isValid'];
          default:
            return true;
        }
      });
    }
  }
});

// Subscribe to store mutations for state persistence
store.subscribe((mutation, state) => {
  // Don't persist while importing
  if (mutation.type !== 'importLessonPlan') {
    saveState(state);
  }
});

export default store;
