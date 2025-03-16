<template>
  <v-container class="parent-form-container">
    <h2 class="text-h4 mb-4">Lesson Plan Generator</h2>
    
    <!-- Basic Information Form -->
    <v-card class="mb-4 basic-info-wrapper" elevation="2">
      <v-card-title class="headline">Basic Information</v-card-title>
      <v-card-text class="py-4">
        <basic-information-form ref="basicForm" />
      </v-card-text>
    </v-card>

    <!-- Framework Selector -->
    <framework-selector ref="frameworkSelector" />

    <!-- Export Options -->
    <export-options />

    <!-- Preview Dialog -->
    <v-dialog v-model="showPreview" width="800">
      <v-card>
        <v-card-title>Preview</v-card-title>
        <v-card-text>
          <pre>{{ JSON.stringify(lessonPlanData, null, 2) }}</pre>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="showPreview = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import BasicInformationForm from './BasicInformationForm.vue';
import FrameworkSelector from './FrameworkSelector.vue';
import ExportOptions from './ExportOptions.vue';

export default defineComponent({
  name: 'ParentLessonPlanForm',

  components: {
    BasicInformationForm,
    FrameworkSelector,
    ExportOptions
  },

  setup() {
    const store = useStore();
    const showPreview = ref(false);

    const lessonPlanData = computed(() => ({
      basePlan: store.getters['baseLessonPlan/currentPlan'],
      frameworks: store.getters['baseLessonPlan/activeFrameworks']
    }));

    onMounted(() => {
      store.dispatch('resetAllStates', null, { root: true });
    });

    return {
      showPreview,
      lessonPlanData
    };
  }
});
</script>

<style scoped>
.parent-form-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
