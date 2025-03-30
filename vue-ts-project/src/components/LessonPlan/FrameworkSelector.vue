<template>
  <v-container>
    <v-card class="mb-4">
      <v-card-title>Select Frameworks</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4" v-for="framework in availableFrameworks" :key="framework.id">
            <v-card
              :color="isFrameworkSelected(framework.id) ? 'primary' : ''"
              :class="[
                'framework-selection-card',
                { 'selected': isFrameworkSelected(framework.id) }
              ]"
              @click="toggleFramework(framework.id)"
              elevation="2"
              hover
            >
              <v-card-text class="d-flex align-center">
                <div class="flex-grow-1">{{ framework.name }}</div>
                <v-icon
                  v-if="isFrameworkSelected(framework.id)"
                  color="white"
                  class="ms-2"
                >
                  mdi-check-circle
                </v-icon>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>


    <!-- Framework Forms -->
    <div class="framework-forms">
      <!-- Common Core -->
      <v-card v-show="isFrameworkSelected('commonCore')" class="mb-4 framework-card">
        <v-card-title>Common Core</v-card-title>
        <v-card-text class="framework-content">
          <Suspense>
            <template #default>
              <CommonCoreForm class="framework-component" />
            </template>
            <template #fallback>
              <v-skeleton-loader
                type="article"
                class="framework-component"
              ></v-skeleton-loader>
            </template>
          </Suspense>
        </v-card-text>
      </v-card>

      <!-- Next Gen Science -->
      <v-card v-show="isFrameworkSelected('nextGenScience')" class="mb-4 framework-card">
        <v-card-title>Next Generation Science</v-card-title>
        <v-card-text class="framework-content">
          <Suspense>
            <template #default>
              <NextGenScienceForm class="framework-component" />
            </template>
            <template #fallback>
              <v-skeleton-loader
                type="article"
                class="framework-component"
              ></v-skeleton-loader>
            </template>
          </Suspense>
        </v-card-text>
      </v-card>

      <!-- WIDA -->
      <v-card v-show="isFrameworkSelected('wida')" class="mb-4 framework-card">
        <v-card-title>WIDA Standards</v-card-title>
        <v-card-text class="framework-content">
          <Suspense>
            <template #default>
              <WIDAForm class="framework-component" />
            </template>
            <template #fallback>
              <v-skeleton-loader
                type="article"
                class="framework-component"
              ></v-skeleton-loader>
            </template>
          </Suspense>
        </v-card-text>
      </v-card>
    </div>

    <!-- Error Handling -->
    <v-snackbar
      v-model="showError"
      color="error"
      :timeout="5000"
    >
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showError = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onErrorCaptured } from 'vue';
import { useStore } from 'vuex';
import CommonCoreForm from '../Frameworks/CommonCoreForm/index.vue';
import NextGenScienceForm from '../Frameworks/NextGenScienceForm/index.vue';
import WIDAForm from '../Frameworks/WIDAForm/index.vue';

interface Framework {
  id: string;
  name: string;
}

const availableFrameworks: Framework[] = [
  {
    id: 'commonCore',
    name: 'Common Core'
  },
  {
    id: 'nextGenScience',
    name: 'Next Generation Science'
  },
  {
    id: 'wida',
    name: 'WIDA Standards'
  }
];

export default defineComponent({
  name: 'FrameworkSelector',

  components: {
    CommonCoreForm,
    NextGenScienceForm,
    WIDAForm
  },

  setup() {
    const store = useStore();
    const isDevelopment = ref(import.meta.env.DEV);
    const showError = ref(false);
    const errorMessage = ref('');
    
    const activeFrameworks = computed(() => store.state.baseLessonPlan.activeFrameworks || []);

    const isFrameworkSelected = (frameworkId: string): boolean => 
      activeFrameworks.value.includes(frameworkId);

    const toggleFramework = async (frameworkId: string) => {
      try {
        const newFrameworks = isFrameworkSelected(frameworkId)
          ? activeFrameworks.value.filter((fw: string) => fw !== frameworkId)
          : [...activeFrameworks.value, frameworkId];
          
        await store.dispatch('baseLessonPlan/setActiveFrameworks', newFrameworks);
        
        // Initialize or reset framework state when selected
        if (!isFrameworkSelected(frameworkId)) {
          await store.dispatch(`${frameworkId}/resetState`);
        }
      } catch (error) {
        showError.value = true;
        errorMessage.value = 'Error toggling framework: ' + (error instanceof Error ? error.message : String(error));
      }
    };

    // Error handling for async components
    onErrorCaptured((error, instance, info) => {
      console.error('Framework error:', error, instance, info);
      showError.value = true;
      errorMessage.value = 'Error loading framework: ' + (error instanceof Error ? error.message : String(error));
      return false; // prevent error propagation
    });

    return {
      activeFrameworks,
      availableFrameworks,
      isDevelopment,
      isFrameworkSelected,
      toggleFramework,
      showError,
      errorMessage
    };
  }
});
</script>

<style scoped>
.framework-card {
  margin-bottom: 16px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.framework-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.framework-component {
  min-height: 400px;
  flex: 1;
}

.framework-selection-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.framework-selection-card.selected {
  color: white;
}

.framework-selection-card:hover {
  transform: translateY(-2px);
}

</style>
