<template>
  <v-container role="region" aria-label="Learning Activities Section">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h2 class="text-h5">Learning Activities</h2>
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedActivities"
              :items="availableActivities"
              label="Select Activities"
              multiple
              chips
              aria-label="Available learning activities"
              :aria-description="'Selected activities: ' + (selectedActivities.length ? selectedActivities.join(', ') : 'None')"
              :hint="'Selected: ' + selectedActivities.length + ' activities'"
              persistent-hint
              @update:model-value="updateActivities"
            ></v-select>
            
            <v-text-field
              v-model="customActivity"
              label="Add Custom Activity"
              append-icon="mdi-plus"
              aria-label="Add custom activity"
              :hint="'Press Enter or click the plus icon to add'"
              persistent-hint
              @click:append="addCustomActivity"
              @keyup.enter="addCustomActivity"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { getAvailableActivities } from '@/services/lessonPlanData';

export default defineComponent({
  name: 'ActivityGenerator',
  setup() {
    const store = useStore();
    const customActivity = ref('');
    const selectedActivities = ref<string[]>([]);

    // Dynamic activity options based on grade level
    const availableActivities = computed(() => {
      const gradeLevel = store.getters['lessonPlan/currentLessonPlan'].gradeLevel;
      return getAvailableActivities(gradeLevel);
    });

    // Initialize from store
    const currentPlan = store.getters['lessonPlan/currentLessonPlan'];
    selectedActivities.value = currentPlan.activities || [];

    // Watch for grade level changes
    watch(
      () => store.getters['lessonPlan/currentLessonPlan'].gradeLevel,
      () => {
        // Clear activities that aren't available for the new grade level
        selectedActivities.value = selectedActivities.value.filter(
          activity => availableActivities.value.includes(activity)
        );
        updateActivities();
      }
    );

    const updateActivities = () => {
      store.dispatch('lessonPlan/updateLessonPlan', {
        activities: selectedActivities.value
      });
    };

    const addCustomActivity = () => {
      if (customActivity.value.trim()) {
        selectedActivities.value.push(customActivity.value.trim());
        updateActivities();
        customActivity.value = '';
      }
    };

    return {
      selectedActivities,
      availableActivities,
      customActivity,
      updateActivities,
      addCustomActivity
    };
  }
});
</script>