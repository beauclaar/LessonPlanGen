<template>
  <v-card class="mb-4 export-card">
    <v-card-title>Export Options</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="4">
          <v-btn
            color="primary"
            block
            :disabled="!isFormValid"
            @click="exportJSON"
            :loading="isExporting"
          >
            Export as JSON
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn
            color="success"
            block
            :disabled="!isFormValid"
            @click="exportPDF"
            :loading="isExporting"
          >
            Export as PDF
          </v-btn>
        </v-col>
        <v-col cols="12" md="4">
          <v-btn
            color="info"
            block
            :disabled="!isFormValid"
            @click="generateLLMPrompt"
            :loading="isExporting"
          >
            Generate LLM Prompt
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showError"
      color="error"
      timeout="3000"
    >
      {{ exportError }}
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ExportOptions',

  setup() {
    const store = useStore();
    const showError = ref(false);

    const isFormValid = computed(() => 
      store.getters['baseLessonPlan/isBaseFormValid']
    );

    const isExporting = computed(() => 
      store.state.exportUtils.isExporting
    );

    const exportError = computed(() => 
      store.state.exportUtils.exportError
    );

    watch(exportError, (error) => {
      if (error) {
        showError.value = true;
      }
    });

    const exportJSON = async () => {
      store.commit('exportUtils/SET_EXPORTING', true);
      try {
        await store.dispatch('exportUtils/exportToJSON');
      } finally {
        store.commit('exportUtils/SET_EXPORTING', false);
      }
    };

    const exportPDF = async () => {
      store.commit('exportUtils/SET_EXPORTING', true);
      try {
        await store.dispatch('exportUtils/exportToPDF');
      } finally {
        store.commit('exportUtils/SET_EXPORTING', false);
      }
    };

    const generateLLMPrompt = async () => {
      store.commit('exportUtils/SET_EXPORTING', true);
      try {
        const prompt = await store.dispatch('exportUtils/generateLLMPrompt');
        await navigator.clipboard.writeText(prompt);
        showError.value = true;
      } catch (error) {
        store.commit('exportUtils/SET_ERROR', 'Failed to generate LLM prompt');
      } finally {
        store.commit('exportUtils/SET_EXPORTING', false);
      }
    };

    return {
      showError,
      isFormValid,
      isExporting,
      exportError,
      exportJSON,
      exportPDF,
      generateLLMPrompt
    };
  }
});
</script>

<style scoped>
.export-card {
  border-radius: 8px;
  background: linear-gradient(135deg, #bbdefb 0%, #90caf9 100%);
}
</style>
