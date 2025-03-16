<template>
  <v-container role="region" aria-label="Assessments Section">
    <!-- Formative Assessments -->
    <v-card class="mb-4">
      <v-card-title>
        <h2 class="text-h5">Formative Assessments</h2>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col v-for="(_, index) in 5" :key="index" cols="12" md>
            <v-card variant="outlined">
              <v-card-title>
                <h3 class="text-subtitle-1">Day {{ index + 1 }}</h3>
              </v-card-title>
              <v-card-text>
                <v-select
                  v-model="formativeAssessments[index].assessment"
                  :items="assessmentOptions"
                  :label="`Select Assessment for Day ${index + 1}`"
                  :aria-label="`Day ${index + 1} assessment type`"
                  @update:model-value="updateFormativeAssessment(index)"
                ></v-select>
                <v-textarea
                  v-model="formativeAssessments[index].notes"
                  :label="`Notes for Day ${index + 1}`"
                  :aria-label="`Additional notes for Day ${index + 1} assessment`"
                  rows="2"
                  @update:model-value="updateFormativeAssessment(index)"
                ></v-textarea>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Summative Assessments -->
    <v-row>
      <!-- Content Assessment -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <h2 class="text-h5">Content Summative Assessment</h2>
          </v-card-title>
          <v-card-text>
            <div role="group" aria-labelledby="content-assessment-title">
              <span id="content-assessment-title" class="sr-only">Content Assessment Options</span>
              <v-select
                v-model="contentSummative.selectedAssessment"
                :items="summativeOptions"
                label="Select Assessment Type"
                aria-label="Content assessment type"
                @update:model-value="updateContentSummative"
              ></v-select>
              <v-text-field
                v-if="contentSummative.selectedAssessment === 'Other'"
                v-model="contentSummative.otherAssessment"
                label="Specify Other Assessment"
                aria-label="Specify other content assessment type"
                @update:model-value="updateContentSummative"
              ></v-text-field>
              <v-textarea
                v-model="contentSummative.notes"
                label="Assessment Notes"
                aria-label="Content assessment notes"
                rows="3"
                @update:model-value="updateContentSummative"
              ></v-textarea>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Language Assessment -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <h2 class="text-h5">Language Summative Assessment</h2>
          </v-card-title>
          <v-card-text>
            <div role="group" aria-labelledby="language-assessment-title">
              <span id="language-assessment-title" class="sr-only">Language Assessment Options</span>
              <v-select
                v-model="languageSummative.selectedAssessment"
                :items="summativeOptions"
                label="Select Assessment Type"
                aria-label="Language assessment type"
                @update:model-value="updateLanguageSummative"
              ></v-select>
              <v-text-field
                v-if="languageSummative.selectedAssessment === 'Other'"
                v-model="languageSummative.otherAssessment"
                label="Specify Other Assessment"
                aria-label="Specify other language assessment type"
                @update:model-value="updateLanguageSummative"
              ></v-text-field>
              <v-textarea
                v-model="languageSummative.notes"
                label="Assessment Notes"
                aria-label="Language assessment notes"
                rows="3"
                @update:model-value="updateLanguageSummative"
              ></v-textarea>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- General Assessment Notes -->
    <v-card class="mt-4">
      <v-card-title>
        <h2 class="text-h5">Additional Assessment Notes</h2>
      </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="assessmentNotes"
          label="Additional Notes"
          aria-label="Additional assessment notes and comments"
          rows="4"
          @update:model-value="updateAssessmentNotes"
        ></v-textarea>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import type { DailyFormativeAssessment, SummativeAssessment } from '@/store/modules/lessonPlan';
import { getAvailableAssessments } from '@/services/lessonPlanData';

export default defineComponent({
  name: 'AssessmentSection',
  setup() {
    const store = useStore();

    // Dynamic assessment options based on grade level
    const assessmentOptions = computed(() => {
      const gradeLevel = store.getters['lessonPlan/currentLessonPlan'].gradeLevel;
      return getAvailableAssessments(gradeLevel).formative;
    });

    // Dynamic summative options based on grade level
    const summativeOptions = computed(() => {
      const gradeLevel = store.getters['lessonPlan/currentLessonPlan'].gradeLevel;
      return getAvailableAssessments(gradeLevel).summative;
    });

    // Initialize from store
    const currentPlan = store.getters['lessonPlan/currentLessonPlan'];
    const formativeAssessments = ref<DailyFormativeAssessment[]>(
      currentPlan.formativeAssessments
    );
    const contentSummative = ref<SummativeAssessment>(
      currentPlan.contentSummativeAssessment
    );
    const languageSummative = ref<SummativeAssessment>(
      currentPlan.languageSummativeAssessment
    );
    const assessmentNotes = ref(currentPlan.assessmentNotes);

    // Watch for grade level changes to reset assessments if needed
    watch(
      () => store.getters['lessonPlan/currentLessonPlan'].gradeLevel,
      () => {
        // Reset formative assessments when grade level changes
        formativeAssessments.value = formativeAssessments.value.map(assessment => ({
          ...assessment,
          assessment: ''
        }));
        updateFormativeAssessment(-1); // Update all assessments

        // Reset summative assessments
        if (!summativeOptions.value.includes(contentSummative.value.selectedAssessment)) {
          contentSummative.value = { selectedAssessment: '', otherAssessment: '', notes: '' };
          updateContentSummative();
        }
        if (!summativeOptions.value.includes(languageSummative.value.selectedAssessment)) {
          languageSummative.value = { selectedAssessment: '', otherAssessment: '', notes: '' };
          updateLanguageSummative();
        }
      }
    );

    const updateFormativeAssessment = (index: number) => {
      const updatedAssessments = [...formativeAssessments.value];
      store.dispatch('lessonPlan/updateLessonPlan', {
        formativeAssessments: updatedAssessments
      });
    };

    const updateContentSummative = () => {
      store.dispatch('lessonPlan/updateLessonPlan', {
        contentSummativeAssessment: contentSummative.value
      });
    };

    const updateLanguageSummative = () => {
      store.dispatch('lessonPlan/updateLessonPlan', {
        languageSummativeAssessment: languageSummative.value
      });
    };

    const updateAssessmentNotes = () => {
      store.dispatch('lessonPlan/updateLessonPlan', {
        assessmentNotes: assessmentNotes.value
      });
    };

    return {
      assessmentOptions,
      summativeOptions,
      formativeAssessments,
      contentSummative,
      languageSummative,
      assessmentNotes,
      updateFormativeAssessment,
      updateContentSummative,
      updateLanguageSummative,
      updateAssessmentNotes
    };
  }
});
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>