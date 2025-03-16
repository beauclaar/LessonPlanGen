<template>
  <v-select
    v-model="selectedGrade"
    :items="gradeOptions"
    label="Select Grade Level"
    required
    :rules="[v => !!v || 'Grade level is required']"
    @update:model-value="handleGradeChange"
  ></v-select>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'GradeLevelSelect',
  setup() {
    const store = useStore();
    const selectedGrade = ref('K - Kindergarten'); // Set default to Kindergarten

    const gradeOptions = [
      'K - Kindergarten',
      '1 - 1st Grade',
      '2 - 2nd Grade',
      '3 - 3rd Grade',
      '4 - 4th Grade',
      '5 - 5th Grade',
      '6 - 6th Grade',
      '7 - 7th Grade',
      '8 - 8th Grade',
      '9 - Freshman',
      '10 - Sophomore',
      '11 - Junior',
      '12 - Senior'
    ];

    // Initialize with Kindergarten
    store.dispatch('lessonPlan/updateLessonPlan', {
      gradeLevel: 'K'
    });

    const handleGradeChange = (value: string) => {
      if (!value) return;
      
      // Extract grade level number from the selected option
      const gradeNum = value.startsWith('K') ? 'K' : value.split(' ')[0];
      
      store.dispatch('lessonPlan/updateLessonPlan', {
        gradeLevel: gradeNum
      });
    };

    // Initialize from store if exists
    const currentPlan = store.getters['lessonPlan/currentLessonPlan'];
    if (currentPlan?.gradeLevel) {
      const grade = currentPlan.gradeLevel;
      selectedGrade.value = gradeOptions.find(option => 
        option.startsWith(grade === 'K' ? 'K' : `${grade} -`)
      ) || 'K - Kindergarten'; // Fallback to Kindergarten
    }

    return {
      selectedGrade,
      gradeOptions,
      handleGradeChange
    };
  }
});
</script>