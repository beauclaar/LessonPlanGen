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

    <!-- Debug Panel -->
    <v-card v-if="isDevelopment" class="mb-4 debug-card">
      <v-card-title class="debug-title">Framework Debug Info</v-card-title>
      <v-card-text>
        <pre class="debug-content">
Active Frameworks: {{ activeFrameworks }}
        </pre>
      </v-card-text>
    </v-card>

    <!-- Framework Forms -->
    <div class="framework-forms">
      <!-- Common Core -->
      <v-card v-show="true" class="mb-4 framework-card">
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
      <v-card v-show="true" class="mb-4 framework-card">
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
      <v-card v-show="true" class="mb-4 framework-card">
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

const availableFrameworks = [
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
    
    // Debug mode: Always show all frameworks
    const activeFrameworks = computed(() => ['commonCore', 'nextGenScience', 'wida']);

    const isFrameworkActive = (): boolean => true;

    const isFrameworkSelected = (frameworkId: string): boolean => 
      activeFrameworks.value.includes(frameworkId);

    // Debug mode: Framework selection disabled but still updates store
    const toggleFramework = async (frameworkId: string) => {
      try {
        console.log('[FrameworkSelector] Debug mode: Framework selection disabled');
        // Still update store to maintain framework state
        await store.dispatch('baseLessonPlan/setActiveFrameworks', activeFrameworks.value);
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

    // Initialize all frameworks and their states
    const initializeFrameworks = async () => {
      try {
        // Reset any existing state first
        await store.dispatch('resetAllStates');
        
        // Set active frameworks
        await store.dispatch('baseLessonPlan/setActiveFrameworks', activeFrameworks.value);
        
        // Initialize each framework
        for (const framework of activeFrameworks.value) {
          try {
            await store.dispatch(`${framework}/resetState`);
          } catch (error) {
            console.error(`Error initializing ${framework}:`, error);
            showError.value = true;
            errorMessage.value = `Error initializing ${framework}: ${error instanceof Error ? error.message : String(error)}`;
          }
        }
      } catch (error) {
        console.error('Error in framework initialization:', error);
        showError.value = true;
        errorMessage.value = 'Error initializing frameworks: ' + (error instanceof Error ? error.message : String(error));
      }
    };

    // Call initialization on mount
    initializeFrameworks();

    return {
      activeFrameworks,
      availableFrameworks,
      isDevelopment,
      isFrameworkActive,
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

.debug-card {
  background-color: #f5f5f5;
}

.debug-title {
  color: #666;
  font-size: 0.9rem;
}

.debug-content {
  font-family: monospace;
  font-size: 0.9rem;
  white-space: pre-wrap;
}
</style>
