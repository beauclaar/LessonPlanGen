<template>
  <v-container>
    <v-form @submit.prevent="handleSubmit">
      <!-- Section 1: Basic Information -->
      <v-card class="mb-4 section-card section-basic">
        <v-card-title>Basic Information</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="lessonPlan.title"
                label="Lesson Title"
                required
                :rules="[v => !!v || 'Title is required']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <grade-level-select />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="lessonPlan.topic"
                label="Topic"
                required
                :rules="[v => !!v || 'Topic is required']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="lessonPlan.duration"
                label="Duration (minutes)"
                type="number"
                required
                :rules="[v => !!v || 'Duration is required']"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Section 2: WIDA Standards (what) -->
      <v-card class="mb-4 section-card section-wida">
        <v-card-title>WIDA Standards (what)</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="lessonPlan.languageDomains"
                :items="languageDomains"
                label="Select Language Domains"
                multiple
                chips
                required
                :rules="[v => v.length > 0 || 'At least one domain is required']"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="lessonPlan.proficiencyLevels"
                :items="proficiencyLevels"
                label="Select Proficiency Levels"
                multiple
                chips
                required
                :rules="[v => v.length > 0 || 'At least one proficiency level is required']"
                item-title="text" 
                item-value="value"
                @update:model-value="updateProficiencyLevels"
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip v-bind="props">{{ item.raw.value }}</v-chip>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="lessonPlan.contentObjective"
                label="Content Objective"
                required
                :rules="[v => !!v || 'Content objective is required']"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Section 3: Practical Strategies and Resources -->
      <v-card class="mb-4 section-card section-strategies">
        <v-card-title>Practical Strategies and Resources</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="lessonPlan.languageTarget"
                :items="languageOfOptions"
                label="Language of..."
                required
                :rules="[v => !!v || 'Language of... is required']"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-1 mb-2">Supports</h3>
              <support-selector />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <h3 class="text-subtitle-1 mb-2">Activities</h3>
              <activity-generator />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Section 4: Assessments -->
      <v-card class="mb-4 section-card section-assessments">
        <v-card-title>Assessments</v-card-title>
        <v-card-text>
          <assessment-section />
        </v-card-text>
      </v-card>

      <!-- Form Actions -->
      <v-card-actions class="justify-end">
        <v-btn
          type="submit"
          color="primary"
          :disabled="!isFormValid"
          size="large"
        >
          Preview Lesson Plan
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SupportSelector from './SupportSelector.vue';
import ActivityGenerator from './ActivityGenerator.vue';
import AssessmentSection from './AssessmentSection.vue';
import GradeLevelSelect from './GradeLevelSelect.vue';

export default defineComponent({
  name: 'LessonPlanForm',
  components: {
    SupportSelector,
    ActivityGenerator,
    AssessmentSection,
    GradeLevelSelect
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const lessonPlan = computed(() => store.getters['lessonPlan/currentLessonPlan']);
    const isFormValid = computed(() => store.getters['lessonPlan/isLessonPlanValid']);

    const languageDomains = [
      'Listening',
      'Speaking',
      'Reading',
      'Writing'
    ];

    const proficiencyLevels = [
      { text: 'Entering - Level 1', value: 'Entering' },
      { text: 'Emerging - Level 2', value: 'Emerging' },
      { text: 'Developing - Level 3', value: 'Developing' },
      { text: 'Expanding - Level 4', value: 'Expanding' },
      { text: 'Bridging - Level 5', value: 'Bridging' },
      { text: 'Reaching - Level 6', value: 'Reaching' }
    ];

    const languageOfOptions = [
      'Language Arts',
      'Mathematics',
      'Science',
      'Social Studies'
    ];

    console.log('Proficiency Levels:', proficiencyLevels);
    console.log('Lesson Plan Proficiency Levels:', lessonPlan.value.proficiencyLevels);

    const handleSubmit = () => {
      if (isFormValid.value) {
        router.push('/preview');
      }
    };

    const updateProficiencyLevels = (values: string[]) => {
      console.log('Updated Proficiency Levels:', values);
      store.dispatch('lessonPlan/updateLessonPlan', { proficiencyLevels: values });
    };

    return {
      lessonPlan,
      isFormValid,
      languageDomains,
      proficiencyLevels,
      languageOfOptions,
      handleSubmit,
      updateProficiencyLevels
    };
  }
});
</script>

<style scoped>
.section-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* Pink 50 to Pink 100 gradient */
.section-basic {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
}

/* Pink 100 to Purple 100 gradient */
.section-wida {
  background: linear-gradient(135deg, #f8bbd0 0%, #e1bee7 100%);
}

/* Purple 100 to Indigo 100 gradient */
.section-strategies {
  background: linear-gradient(135deg, #e1bee7 0%, #c5cae9 100%);
}

/* Indigo 100 to Light Blue 100 gradient */
.section-assessments {
  background: linear-gradient(135deg, #c5cae9 0%, #b3e5fc 100%);
}

.v-card-title {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
}
</style>