<template>
  <div class="common-core-form-wrapper">
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
      class="common-core-form rounded-lg elevation-1"
      @submit.prevent
    >
      <v-row>
        <v-col cols="12">
          <v-select
            v-model="grade"
            :items="gradeOptions"
            label="Grade Level"
            required
            :rules="[v => !!v || 'Grade level is required']"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="strand"
            :items="strandOptions"
            label="Content Strand"
            required
            :rules="[v => !!v || 'Content strand is required']"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="selectedStandards"
            :items="standardsOptions"
            label="Select Standards"
            multiple
            chips
            required
            :rules="[v => v.length > 0 || 'At least one standard is required']"
          >
            <template v-slot:chip="{ props, item }">
              <v-chip v-bind="props">{{ item.raw.code }}</v-chip>
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <v-list-item-title>{{ item.raw.code }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col cols="12">
          <v-textarea
            v-model="standardsAlignment"
            label="Standards Alignment Notes"
            hint="Explain how the lesson aligns with selected standards"
            persistent-hint
          ></v-textarea>
        </v-col>
      </v-row>
    </v-form>
    <div v-if="isDevelopment" class="debug-panel pa-4">
      <pre>Component State:
        Is Framework Active: {{ isFrameworkActive }}
        Loading: {{ isLoading }}
        Error: {{ error }}
        Grade: {{ grade }}
        Strand: {{ strand }}
        Selected Standards: {{ selectedStandards }}
      </pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue';
import { useStore } from 'vuex';

interface Standard {
  code: string;
  description: string;
}

export default defineComponent({
  name: 'CommonCoreForm',

  emits: ['mounted'],

  async setup(props, { emit }) {
    const store = useStore();
    const isDevelopment = ref(import.meta.env.DEV);
    const mountStatus = ref<'mounting' | 'mounted' | 'error'>('mounting');

    // Framework states
    const isFrameworkActive = computed(() => 
      store.getters['baseLessonPlan/activeFrameworks'].includes('commonCore')
    );

    const activeFrameworksList = computed(() => 
      store.getters['baseLessonPlan/activeFrameworks'].join(', ')
    );

    const isLoading = computed(() => store.getters['commonCore/isLoading']);
    const error = computed(() => store.getters['commonCore/getError']);

    onMounted(async () => {
      try {
        console.log('[CommonCore] Starting component mount');
        await store.dispatch('commonCore/resetState');
        console.log('[CommonCore] State reset complete');
        console.log('[CommonCore] Framework active:', isFrameworkActive.value);
        console.log('[CommonCore] Current state:', store.state.commonCore);
        console.log('[CommonCore] Active frameworks:', store.getters['baseLessonPlan/activeFrameworks']);
        
        mountStatus.value = 'mounted';
        emit('mounted');
        console.log('[CommonCore] Component mounted successfully');
      } catch (error) {
        console.error('[CommonCore] Error during mount:', error);
        mountStatus.value = 'error';
      }
    });
    
    const grade = computed({
      get: () => store.state.commonCore.grade,
      set: (value: string) => store.dispatch('commonCore/updateGrade', value)
    });

    const strand = computed({
      get: () => store.state.commonCore.strand,
      set: (value: string) => store.dispatch('commonCore/updateStrand', value)
    });

    const gradeOptions = [
      'K', '1', '2', '3', '4', '5',
      '6', '7', '8', '9', '10', '11', '12'
    ];

    const strandOptions = computed(() => {
      const topic = store.getters['baseLessonPlan/currentPlan'].topic;
      
      if (topic === 'Mathematics') {
        return [
          'Number & Operations',
          'Algebra',
          'Geometry',
          'Measurement & Data',
          'Statistics & Probability'
        ];
      }
      
      return [
        'Reading Literature',
        'Reading Informational Text',
        'Writing',
        'Speaking & Listening',
        'Language'
      ];
    });

    const standardsOptions = ref<Standard[]>([
      { code: 'PLACEHOLDER.1', description: 'This is a placeholder standard' },
      { code: 'PLACEHOLDER.2', description: 'Another placeholder standard' }
    ]);

    const selectedStandards = computed({
      get: () => store.state.commonCore.selectedStandards,
      set: (value: Standard[]) => store.dispatch('commonCore/updateStandards', value)
    });

    const standardsAlignment = computed({
      get: () => store.state.commonCore.standardsAlignment,
      set: (value: string) => store.dispatch('commonCore/updateAlignment', value)
    });

    return {
      isFrameworkActive,
      activeFrameworksList,
      isDevelopment,
      mountStatus,
      isLoading,
      error,
      grade,
      strand,
      gradeOptions,
      strandOptions,
      standardsOptions,
      selectedStandards,
      standardsAlignment
    };
  }
});
</script>

<style scoped>
.common-core-form-wrapper {
  position: relative;
  width: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.common-core-form {
  padding: 1rem;
  min-height: 400px;
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
