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
            :items="gradeLevels"
            label="Grade Level"
            required
            :rules="[v => !!v || 'Grade level is required']"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="subject"
            :items="subjectOptions"
            label="Subject"
            required
            :rules="[v => !!v || 'Subject is required']"
            :disabled="!grade"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="contentStrand"
            :items="contentStrandOptions"
            label="Content Strand"
            required
            :rules="[v => !!v || 'Content strand is required']"
            :disabled="!subject"
          ></v-select>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="selectedStandards"
            :items="standardOptions"
            label="Standards"
            multiple
            chips
            required
            :rules="[v => v.length > 0 || 'At least one standard is required']"
            :disabled="!contentStrand"
          ></v-select>
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import standardsData from '@/data/commonCoreStandards.json';

const store = useStore();
const isDevelopment = ref(import.meta.env.DEV);

// Framework states
const isFrameworkActive = computed(() => 
  store.getters['baseLessonPlan/activeFrameworks'].includes('commonCore')
);

const activeFrameworksList = computed(() => 
  store.getters['baseLessonPlan/activeFrameworks'].join(', ')
);

const isLoading = computed(() => store.getters['commonCore/isLoading']);
const error = computed(() => store.getters['commonCore/getError']);

// Form state
const grade = computed({
  get: () => store.state.commonCore.grade,
  set: (value: string) => {
    store.dispatch('commonCore/updateGrade', value);
    store.dispatch('commonCore/updateSubject', '');
    store.dispatch('commonCore/updateContentStrand', '');
    store.dispatch('commonCore/updateStandards', []);
  }
});

const subject = computed({
  get: () => store.state.commonCore.subject,
  set: (value: string) => {
    store.dispatch('commonCore/updateSubject', value);
    store.dispatch('commonCore/updateContentStrand', '');
    store.dispatch('commonCore/updateStandards', []);
  }
});

const contentStrand = computed({
  get: () => store.state.commonCore.contentStrand,
  set: (value: string) => {
    store.dispatch('commonCore/updateContentStrand', value);
    store.dispatch('commonCore/updateStandards', []);
  }
});

const selectedStandards = computed({
  get: () => store.state.commonCore.selectedStandards,
  set: (value: string[]) => store.dispatch('commonCore/updateStandards', value)
});

const gradeLevels = [
  'Kindergarten',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grades 9-10',
  'Grades 11-12'
];
const gradeOptions = gradeLevels;

const gradeKey = computed(() => {
  if (!grade.value) return [];
  if (grade.value === 'Kindergarten') return ['K'];
  if (grade.value.startsWith('Grade ')) {
    return [grade.value.replace('Grade ', '').trim()];
  }
  if (grade.value.startsWith('Grades ')) {
    return [grade.value.replace('Grades ', '').trim()];
  }
  return [grade.value];
});

const subjectOptions = computed(() => {
  if (!grade.value) return [];
  return ['ELA', 'Math'];
});

const contentStrandOptions = computed(() => {
  if (!grade.value || !subject.value) return [];
  const strands = new Set<string>();
  gradeKey.value.forEach((key: string) => {
    const options = Object.keys((standardsData as Record<string, Record<string, Record<string, string[]>>>)[subject.value][key] || {});
    options.forEach(option => strands.add(option));
  });
  return Array.from(strands);
});

const standardOptions = computed(() => {
  if (!grade.value || !subject.value || !contentStrand.value) return [];
  const standards = new Set<string>();
  gradeKey.value.forEach((key: string) => {
    const options = (standardsData as Record<string, Record<string, Record<string, string[]>>>)[subject.value][key]?.[contentStrand.value] || [];
    options.forEach(option => standards.add(option));
  });
  return Array.from(standards);
});

const standardsAlignment = computed({
  get: () => store.state.commonCore.standardsAlignment,
  set: (value: string) => store.dispatch('commonCore/updateAlignment', value)
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
