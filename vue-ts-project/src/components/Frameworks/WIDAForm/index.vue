<template>
  <div class="wida-form-wrapper">
    <div v-if="!isFrameworkActive" class="debug-info pa-4">
      <v-alert type="info" class="mb-2">
        Framework not active. Current active frameworks: {{ activeFrameworksList }}
      </v-alert>
    </div>
    <div v-else-if="error" class="error-state pa-4">
      <v-alert type="error" class="mb-2">
        {{ error }}
      </v-alert>
    </div>
    <v-skeleton-loader
      v-else-if="isLoading"
      type="article"
      class="mx-auto pa-4"
    />
    <v-form
      v-else
      ref="form"
      v-model="isValid"
      class="wida-form rounded-lg elevation-1"
      @submit.prevent
    >
      <div class="form-content">
        <v-row class="fill-height">
          <v-col cols="12" sm="12" md="6">
            <v-select
              v-model="gradeLevelCluster"
              :items="gradeLevelClusterOptions"
              label="Grade Level Cluster"
              item-title="text"
              item-value="value"
              required
              ref="firstInput"
              :rules="[v => !!v || 'Grade level cluster is required']"
              :menu-props="{ maxHeight: 400 }"
              persistent-hint
              hint="Select a grade level cluster"
            />
          </v-col>

          <v-col cols="12" sm="12" md="6">
            <v-select
              v-model="widaStandards"
              :items="standardsOptions"
              label="WIDA Standards"
              multiple
              chips
              required
              :rules="[v => v && v.length > 0 || 'At least one standard is required']"
              :menu-props="{ maxHeight: 400 }"
              persistent-hint
              hint="Select one or more WIDA standards"
            />
          </v-col>

          <v-col cols="12" sm="12" md="6">
            <v-select
              v-model="languageDomains"
              :items="domainOptions"
              label="Select Language Domains"
              multiple
              chips
              required
              :rules="[v => v && v.length > 0 || 'At least one domain is required']"
              :menu-props="{ maxHeight: 400 }"
              persistent-hint
              hint="Select one or more language domains"
            />
          </v-col>

          <v-col cols="12" sm="12" md="6">
            <v-select
              v-model="proficiencyLevels"
              :items="proficiencyOptions"
              label="Select Proficiency Levels"
              multiple
              chips
              required
              :rules="[v => v && v.length > 0 || 'At least one proficiency level is required']"
              :menu-props="{ maxHeight: 400 }"
              persistent-hint
              hint="Select one or more proficiency levels"
              item-title="text"
              item-value="value"
              return-object
            >
              <template v-slot:chip="{ props, item }">
                <v-chip v-bind="props" :text="item.raw.value" />
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:title>{{ item.raw.text }}</template>
                  <template v-slot:subtitle>{{ item.raw.value }}</template>
                </v-list-item>
              </template>
            </v-select>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="contentObjective"
              label="Content Objective"
              hint="Describe the language objectives for this lesson"
              persistent-hint
              required
              rows="4"
              auto-grow
              :rules="[(v) => !!v || 'Content objective is required']"
            />
          </v-col>

          <v-col cols="12">
            <support-selector />
          </v-col>

          <v-col cols="12" class="d-flex justify-end">
            <v-tooltip
              location="top"
              open-delay="500"
            >
              <template v-slot:default>
                Clear all form fields and start over
              </template>
              <template v-slot:activator="{ props }">
                <v-btn
                  color="error"
                  variant="text"
                  @click="handleReset"
                  class="me-2 reset-btn"
                  v-bind="props"
                  aria-label="Reset form"
                >
                  <v-icon start icon="mdi-refresh" class="me-1" />
                  Reset Form
                </v-btn>
              </template>
            </v-tooltip>
          </v-col>
        </v-row>
      </div>
    </v-form>
    <!-- Debug panel moved outside main form flow -->
    <div v-if="isDevelopment" class="debug-panel pa-4 mt-4">
      <pre>Component State:
        Is Framework Active: {{ isFrameworkActive }}
        Loading: {{ isLoading }}
        Error: {{ error }}
        Form Valid: {{ isValid }}
        Grade Level Cluster: {{ gradeLevelCluster }}
        WIDA Standards: {{ widaStandards }}
        Language Domains: {{ languageDomains }}
        Proficiency Levels: {{ proficiencyLevels }}
        Content Objective: {{ contentObjective }}
      </pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, nextTick, watch } from 'vue';
import { useStore } from 'vuex';
import SupportSelector from '@/components/SupportSelector.vue';

export default defineComponent({
  name: 'WIDAForm',

  components: {
    SupportSelector
  },

  setup() {
    const store = useStore();
    const isDevelopment = ref(import.meta.env.DEV);

    interface VForm extends HTMLFormElement {
      resetValidation: () => void;
      validate: () => boolean;
    }

    const form = ref<VForm | null>(null);
    const firstInput = ref<HTMLElement | null>(null);
    const isValid = computed(() => store.getters['wida/isValid']);
    const isFrameworkActive = computed(() => 
      store.getters['baseLessonPlan/activeFrameworks'].includes('wida')
    );
    const activeFrameworksList = computed(() => 
      store.getters['baseLessonPlan/activeFrameworks'].join(', ')
    );
    const isLoading = computed(() => store.getters['wida/isLoading']);
    const error = computed(() => store.getters['wida/getError']);

    // Initialize form state when mounted
    onMounted(() => {
      store.dispatch('wida/resetState');
    });

    const standardsOptions = [
      'Standard 1',
      'Standard 2',
      'Standard 3',
      'Standard 4',
      'Standard 5'
    ];

    const gradeLevelClusterOptions = [
      { text: 'Kindergarten', value: 'K' },
      { text: 'Grade 1', value: '1' },
      { text: 'Grades 2-3', value: '2-3' },
      { text: 'Grades 4-5', value: '4-5' },
      { text: 'Grades 6-8', value: '6-8' },
      { text: 'Grades 9-12', value: '9-12' }
    ];

    const domainOptions = [
      'Listening',
      'Speaking',
      'Reading',
      'Writing'
    ];

    const proficiencyOptions = [
      { text: 'Entering - Level 1', value: 'Entering' },
      { text: 'Emerging - Level 2', value: 'Emerging' },
      { text: 'Developing - Level 3', value: 'Developing' },
      { text: 'Expanding - Level 4', value: 'Expanding' },
      { text: 'Bridging - Level 5', value: 'Bridging' },
      { text: 'Reaching - Level 6', value: 'Reaching' }
    ];

    const languageDomains = computed({
      get: () => store.state.wida.languageDomains || [],
      set: (value: string[]) => store.dispatch('wida/updateLanguageDomains', value)
    });

    const proficiencyLevels = computed({
      get: () => store.state.wida.proficiencyLevels || [],
      set: (value: any[]) => store.dispatch('wida/updateProficiencyLevels', value)
    });

    const contentObjective = computed({
      get: () => store.state.wida.contentObjective || '',
      set: (value: string) => store.dispatch('wida/updateContentObjective', value)
    });

    const gradeLevelCluster = computed({
      get: () => store.state.wida.gradeLevelCluster || '',
      set: (value: string) => store.dispatch('wida/updateGradeLevelCluster', value)
    });

    const widaStandards = computed({
      get: () => store.state.wida.widaStandards || [],
      set: (value: string[]) => store.dispatch('wida/updateWidaStandards', value)
    });

    const handleReset = async () => {
      try {
        // Reset state through store action
        await store.dispatch('wida/resetState');
        if (form.value) {
          form.value.resetValidation();
        }
      } catch (error) {
        console.error('[WIDA] Error resetting form:', error);
      }
    };

    return {
      form,
      firstInput,
      isValid,
      isDevelopment,
      isLoading,
      error,
      isFrameworkActive,
      activeFrameworksList,
      standardsOptions,
      gradeLevelClusterOptions,
      domainOptions,
      proficiencyOptions,
      gradeLevelCluster,
      widaStandards,
      languageDomains,
      proficiencyLevels,
      contentObjective,
      handleReset
    };
  }
});
</script>

<style lang="scss" scoped>
.wida-form-wrapper {
  position: relative;
  width: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.wida-form {
  padding: 1rem;
  min-height: 400px;
}

.form-content {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.debug-info {
  background-color: #f5f5f5;
  border-radius: 4px;
}

.error-state {
  background-color: #ffebee;
  border-radius: 4px;
}

.debug-panel {
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-top: 1rem;
  font-family: monospace;
  font-size: 0.9em;
  white-space: pre-wrap;
}
</style>
