<template>
  <div class="ngss-form-wrapper">
    <v-form
      class="ngss-form rounded-lg elevation-1"
      @submit.prevent
      v-if="isFrameworkActive"
    >
      <v-row>
        <v-col cols="12">
          <v-select
            v-model="gradeLevel"
            :items="gradeLevelOptions"
            label="Grade Level"
            required
            :rules="[(v) => !!v || 'Grade level is required']"
          />
        </v-col>
        
        <v-col cols="12">
          <v-select
            v-model="scienceDomain"
            :items="domainOptions"
            label="Science Domain"
            required
            :rules="[(v) => !!v || 'Science domain is required']"
          />
        </v-col>
        
        <v-col cols="12">
          <v-select
            v-model="selectedDisciplinaryCoreIdeas"
            :items="disciplinaryCoreIdeasOptions"
            label="Disciplinary Core Ideas (DCI)"
            multiple
            chips
            item-title="description"
            item-value="code"
            return-object
            required
            :rules="[(v) => v.length > 0 || 'At least one DCI is required']"
          >
            <template v-slot:chip="{ props, item }">
              <v-chip v-bind="props" :text="item.raw.code" />
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <template v-slot:title>{{ item.raw.code }}</template>
                <template v-slot:subtitle>{{ item.raw.description }}</template>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        
        <v-col cols="12">
          <v-select
            v-model="selectedPractices"
            :items="sciencePracticesOptions"
            label="Science and Engineering Practices"
            multiple
            chips
            required
            :rules="[(v) => v.length > 0 || 'At least one practice is required']"
          />
        </v-col>
        
        <v-col cols="12">
          <v-select
            v-model="selectedCrossCutting"
            :items="crossCuttingOptions"
            label="Crosscutting Concepts"
            multiple
            chips
            required
            :rules="[(v) => v.length > 0 || 'At least one concept is required']"
          />
        </v-col>
        
        <v-col cols="12">
          <v-textarea
            v-model="performanceExpectations"
            label="Performance Expectations"
            hint="Describe what students should be able to do to demonstrate understanding"
            persistent-hint
            required
            :rules="[(v) => !!v || 'Performance expectations are required']"
          />
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { CoreIdea } from '@/store/modules/nextGenScience';

export default defineComponent({
  name: 'NextGenScienceForm',

  emits: ['mounted'],

  setup(props, { emit }) {
    const store = useStore();

    // Framework active state
    const isFrameworkActive = computed(() => 
      store.getters['baseLessonPlan/activeFrameworks'].includes('nextGenScience')
    );

    onMounted(() => {
      emit('mounted');
    });

    const gradeLevel = computed({
      get: () => store.state.nextGenScience.gradeLevel,
      set: (value: string) => store.dispatch('nextGenScience/updateGradeLevel', value)
    });

    const scienceDomain = computed({
      get: () => store.state.nextGenScience.scienceDomain,
      set: (value: string) => store.dispatch('nextGenScience/updateDomain', value)
    });

    const selectedDisciplinaryCoreIdeas = computed({
      get: () => store.state.nextGenScience.disciplinaryCoreIdeas,
      set: (value: CoreIdea[]) => store.dispatch('nextGenScience/updateCoreIdeas', value)
    });

    const selectedPractices = computed({
      get: () => store.state.nextGenScience.sciencePractices,
      set: (value: string[]) => store.dispatch('nextGenScience/updatePractices', value)
    });

    const selectedCrossCutting = computed({
      get: () => store.state.nextGenScience.crossCuttingConcepts,
      set: (value: string[]) => store.dispatch('nextGenScience/updateCrossCutting', value)
    });

    const performanceExpectations = computed({
      get: () => store.state.nextGenScience.performanceExpectations,
      set: (value: string) => store.dispatch('nextGenScience/updateExpectations', value)
    });

    const gradeLevelOptions = [
      'K-2',
      '3-5',
      'Middle School (6-8)',
      'High School (9-12)'
    ];

    const domainOptions = [
      'Physical Sciences',
      'Life Sciences',
      'Earth and Space Sciences',
      'Engineering, Technology, and Applications of Science'
    ];

    const disciplinaryCoreIdeasOptions = ref<CoreIdea[]>([
      { code: 'PS1', description: 'Matter and Its Interactions' },
      { code: 'PS2', description: 'Motion and Stability: Forces and Interactions' },
      { code: 'PS3', description: 'Energy' },
      { code: 'LS1', description: 'From Molecules to Organisms: Structures and Processes' },
      { code: 'ESS1', description: "Earth's Place in the Universe" }
    ]);

    const sciencePracticesOptions = [
      'Asking Questions and Defining Problems',
      'Developing and Using Models',
      'Planning and Carrying Out Investigations',
      'Analyzing and Interpreting Data',
      'Using Mathematics and Computational Thinking',
      'Constructing Explanations and Designing Solutions',
      'Engaging in Argument from Evidence',
      'Obtaining, Evaluating, and Communicating Information'
    ];

    const crossCuttingOptions = [
      'Patterns',
      'Cause and Effect',
      'Scale, Proportion, and Quantity',
      'Systems and System Models',
      'Energy and Matter',
      'Structure and Function',
      'Stability and Change'
    ];

    return {
      isFrameworkActive,
      gradeLevel,
      scienceDomain,
      selectedDisciplinaryCoreIdeas,
      selectedPractices,
      selectedCrossCutting,
      performanceExpectations,
      gradeLevelOptions,
      domainOptions,
      disciplinaryCoreIdeasOptions,
      sciencePracticesOptions,
      crossCuttingOptions
    };
  }
});
</script>

<style scoped>
.ngss-form-wrapper {
  position: relative;
  width: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.ngss-form {
  padding: 1rem;
  min-height: 400px;
}
</style>
