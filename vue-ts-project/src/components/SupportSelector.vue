<template>
  <v-container role="region" aria-label="Learning Supports Selection">
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <h2 class="text-h6">Sensory Supports</h2>
          </v-card-title>
          <v-card-text>
            <fieldset>
              <legend class="sr-only">Select sensory supports</legend>
              <v-checkbox
                v-for="option in sensoryOptions || []"
                :key="option"
                v-model="selectedSensory"
                :label="option"
                :value="option"
                :aria-label="option"
                :aria-checked="selectedSensory.includes(option)"
                @change="updateSupports"
              ></v-checkbox>
            </fieldset>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <h2 class="text-h6">Graphic Supports</h2>
          </v-card-title>
          <v-card-text>
            <fieldset>
              <legend class="sr-only">Select graphic supports</legend>
              <v-checkbox
                v-for="option in graphicOptions || []"
                :key="option"
                v-model="selectedGraphic"
                :label="option"
                :value="option"
                :aria-label="option"
                :aria-checked="selectedGraphic.includes(option)"
                @change="updateSupports"
              ></v-checkbox>
            </fieldset>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <h2 class="text-h6">Interactive Supports</h2>
          </v-card-title>
          <v-card-text>
            <fieldset>
              <legend class="sr-only">Select interactive supports</legend>
              <v-checkbox
                v-for="option in interactiveOptions || []"
                :key="option"
                v-model="selectedInteractive"
                :label="option"
                :value="option"
                :aria-label="option"
                :aria-checked="selectedInteractive.includes(option)"
                @change="updateSupports"
              ></v-checkbox>
            </fieldset>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { getAvailableSupports } from '@/services/lessonPlanData';

export default defineComponent({
  name: 'SupportSelector',
  setup() {
    const store = useStore();
    
    // Dynamic support options based on grade level with fallback
    const supportOptions = computed(() => {
      try {
        const currentPlan = store.getters['lessonPlan/currentLessonPlan'] || {};
        const gradeLevel = currentPlan.gradeLevel || '6'; // Default to grade 6 if not set
        return getAvailableSupports(gradeLevel);
      } catch (error) {
        console.warn('Error getting support options:', error);
        return {
          sensory: [],
          graphic: [],
          interactive: []
        };
      }
    });

    const sensoryOptions = computed(() => supportOptions.value?.sensory || []);
    const graphicOptions = computed(() => supportOptions.value?.graphic || []);
    const interactiveOptions = computed(() => supportOptions.value?.interactive || []);

    const selectedSensory = ref<string[]>([]);
    const selectedGraphic = ref<string[]>([]);
    const selectedInteractive = ref<string[]>([]);

    // Initialize supports based on context with error handling
    const initializeSupports = () => {
      try {
        const framework = store.getters['baseLessonPlan/activeFrameworks']?.[0];
        const currentPlan = framework === 'wida' 
          ? store.getters['baseLessonPlan/currentPlan'] || {}
          : store.getters['lessonPlan/currentLessonPlan'] || {};

        selectedSensory.value = currentPlan.sensorySupports || [];
        selectedGraphic.value = currentPlan.graphicSupports || [];
        selectedInteractive.value = currentPlan.interactiveSupports || [];
      } catch (error) {
        console.warn('Error initializing supports:', error);
        selectedSensory.value = [];
        selectedGraphic.value = [];
        selectedInteractive.value = [];
      }
    };

    // Initialize on mount
    initializeSupports();

    // Watch for framework changes
    watch(
      () => store.getters['baseLessonPlan/activeFrameworks'] || [],
      () => {
        try {
          initializeSupports();
        } catch (error) {
          console.warn('Error in framework change watcher:', error);
        }
      }
    );

    // Watch for grade level changes with error handling
    watch(
      () => {
        try {
          const framework = store.getters['baseLessonPlan/activeFrameworks']?.[0];
          const currentPlan = framework === 'wida'
            ? store.getters['baseLessonPlan/currentPlan']
            : store.getters['lessonPlan/currentLessonPlan'];
          return currentPlan?.gradeLevel || '6';
        } catch (error) {
          console.warn('Error in grade level watcher:', error);
          return '6';
        }
      },
      () => {
        try {
          selectedSensory.value = selectedSensory.value.filter(
            support => sensoryOptions.value.includes(support)
          );
          selectedGraphic.value = selectedGraphic.value.filter(
            support => graphicOptions.value.includes(support)
          );
          selectedInteractive.value = selectedInteractive.value.filter(
            support => interactiveOptions.value.includes(support)
          );
          updateSupports();
        } catch (error) {
          console.warn('Error filtering supports:', error);
        }
      }
    );

    const updateSupports = () => {
      try {
        const framework = store.getters['baseLessonPlan/activeFrameworks']?.[0];
        const updates = {
          sensorySupports: selectedSensory.value,
          graphicSupports: selectedGraphic.value,
          interactiveSupports: selectedInteractive.value
        };

        if (framework === 'wida') {
          store.dispatch('baseLessonPlan/updatePlan', updates);
        } else {
          store.dispatch('lessonPlan/updateLessonPlan', updates);
        }
      } catch (error) {
        console.warn('Error updating supports:', error);
      }
    };

    return {
      sensoryOptions,
      graphicOptions,
      interactiveOptions,
      selectedSensory,
      selectedGraphic,
      selectedInteractive,
      updateSupports
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
