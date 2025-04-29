<template>
  <div class="basic-form-container">
    <!-- Form Content -->
    <v-form @submit.prevent ref="form">
      <v-row>
        <v-col cols="12">
          <v-text-field
            :model-value="formFields.title"
            @update:model-value="updateField('title', $event)"
            label="Lesson Title"
            required
            :rules="rules.title"
            placeholder="Enter a descriptive title for your lesson"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-textarea
            :model-value="formFields.description"
            @update:model-value="updateField('description', $event)"
            label="Lesson Description"
            placeholder="Enter a detailed description of your lesson"
            clearable
            auto-grow
            rows="3"
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :model-value="formFields.gradeLevel"
            @update:model-value="updateField('gradeLevel', $event)"
            :items="gradeLevels"
            label="Grade Level"
            required
            :rules="rules.gradeLevel"
            placeholder="Select grade level"
            clearable
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-select
            :model-value="formFields.topic"
            @update:model-value="updateField('topic', $event)"
            :items="topics"
            label="Subject/Topic"
            required
            :rules="rules.topic"
            placeholder="Select the main subject area"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            :model-value="formFields.timePerSession"
            @update:model-value="updateField('timePerSession', Number($event))"
            label="Time per Session (minutes)"
            type="number"
            required
            min="1"
            :rules="rules.timePerSession"
            placeholder="e.g., 45"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            :model-value="formFields.occurrence"
            @update:model-value="updateField('occurrence', $event)"
            label="Occurrence"
            required
            :rules="rules.occurrence"
            placeholder="e.g., Once a day for 3 weeks"
            clearable
            hint="How often does this lesson occur?"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            :model-value="formFields.duration"
            @update:model-value="updateField('duration', $event)"
            label="Total Duration"
            required
            :rules="rules.duration"
            placeholder="e.g., 5 weeks, semester"
            clearable
            hint="Total timespan of the lesson plan"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

interface FormData {
  title: string;
  description: string;
  gradeLevel: string;
  topic: string;
  timePerSession: number;
  occurrence: string;
  duration: string;
}

interface FormRules {
  [key: string]: ((v: any) => boolean | string)[];
}

export default defineComponent({
  name: 'BasicInformationForm',

  setup() {
    console.log('BasicInformationForm mounting');
    const store = useStore();
    const form = ref(null);

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
      'Grade 9',
      'Grade 10',
      'Grade 11',
      'Grade 12'
    ];

    const formFields = computed(() => ({
      title: store.getters['baseLessonPlan/currentPlan']?.title || '',
      description: store.getters['baseLessonPlan/currentPlan']?.description || '',
      gradeLevel: store.getters['baseLessonPlan/currentPlan']?.gradeLevel || '',
      topic: store.getters['baseLessonPlan/currentPlan']?.topic || 'Mathematics',
      timePerSession: store.getters['baseLessonPlan/currentPlan']?.timePerSession || 50,
      occurrence: store.getters['baseLessonPlan/currentPlan']?.occurrence || '',
      duration: store.getters['baseLessonPlan/currentPlan']?.duration || ''
    }));

    const rules: FormRules = {
      title: [(v: string) => !!v || 'Title is required'],
      gradeLevel: [(v: string) => !!v || 'Grade Level is required'],
      topic: [(v: string) => !!v || 'Topic is required'],
      timePerSession: [
        (v: number) => !!v || 'Time is required',
        (v: number) => v > 0 || 'Time must be greater than 0'
      ],
      occurrence: [(v: string) => !!v || 'Occurrence is required'],
      duration: [(v: string) => !!v || 'Duration is required']
    };

    const topics = [
      'Mathematics',
      'English Language Arts',
      'Science',
      'History/Social Studies'
    ];

    const updateField = (field: keyof FormData, value: any) => {
      const update = { [field]: value };
      store.dispatch('baseLessonPlan/updateBasePlan', update);
    };

    onMounted(() => {
      console.log('BasicInformationForm mounted');
      // Ensure the store has been initialized with default values
      if (!store.getters['baseLessonPlan/currentPlan']) {
        store.dispatch('baseLessonPlan/updateBasePlan', {
          title: '',
          description: '',
          gradeLevel: '',
          topic: 'Mathematics',
          timePerSession: 50,
          occurrence: '',
          duration: ''
        });
      }
      console.log('Initial store state:', store.getters['baseLessonPlan/currentPlan']);
    });

    return {
      form,
      formFields,
      rules,
      topics,
      gradeLevels,
      updateField
    };
  }
});
</script>

<style scoped>
.basic-form-container {
  width: 100%;
}

.v-text-field {
  margin-top: 8px;
}
</style>
