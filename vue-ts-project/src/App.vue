<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Lesson Plan Generator</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="createNewPlan">New Plan</v-btn>
      <v-btn @click="openImportDialog" class="ml-2">Import</v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <Suspense>
          <template #default>
            <router-view />
          </template>
          <template #fallback>
            <v-skeleton-loader
              type="article"
              class="mx-auto mt-4"
            ></v-skeleton-loader>
          </template>
        </Suspense>
      </v-container>
    </v-main>

    <!-- Import Dialog -->
    <v-dialog v-model="showImportDialog" width="500">
      <v-card>
        <v-card-title>Import Lesson Plan</v-card-title>
        <v-card-text>
          <v-file-input
            v-model="importFile"
            label="Select JSON file"
            accept=".json"
            prepend-icon="mdi-file"
            show-size
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="showImportDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            :disabled="!importFile"
            @click="handleImport"
          >
            Import
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',

  setup() {
    const store = useStore();
    const router = useRouter();

    // Ensure frameworks are initialized after route changes
    router.beforeEach(async (to, from, next) => {
      if (to.path === '/') {
        try {
          // Reset states and initialize frameworks
          await store.dispatch('resetAllStates');
          await store.dispatch('baseLessonPlan/setActiveFrameworks', ['commonCore', 'nextGenScience', 'wida']);
          // Initialize each framework
          for (const framework of ['commonCore', 'nextGenScience', 'wida']) {
            try {
              await store.dispatch(`${framework}/resetState`);
            } catch (error) {
              console.error(`Error initializing ${framework}:`, error);
            }
          }
        } catch (error) {
          console.error('Error in framework initialization:', error);
        }
      }
      next();
    });
    const showImportDialog = ref(false);
    const importFile = ref<File | null>(null);
    const showSnackbar = ref(false);
    const snackbarMessage = ref('');
    const snackbarColor = ref('success');

    const createNewPlan = async () => {
      await store.dispatch('resetAllStates');
      showSnackbar.value = true;
      snackbarMessage.value = 'Created new lesson plan';
      snackbarColor.value = 'success';
      // Force re-render of the form by navigating to root
      if (router.currentRoute.value.path === '/') {
        await router.replace('/refresh');
        await router.replace('/');
      } else {
        await router.push('/');
      }
    };

    const openImportDialog = () => {
      showImportDialog.value = true;
    };

    const handleImport = async () => {
      if (!importFile.value) return;

      try {
        const fileContent = await importFile.value.text();
        const data = JSON.parse(fileContent);
        await store.dispatch('importLessonPlan', data);
        
        showImportDialog.value = false;
        showSnackbar.value = true;
        snackbarMessage.value = 'Lesson plan imported successfully';
        snackbarColor.value = 'success';
      } catch (error) {
        showSnackbar.value = true;
        snackbarMessage.value = 'Error importing lesson plan';
        snackbarColor.value = 'error';
      }
    };

    return {
      showImportDialog,
      importFile,
      showSnackbar,
      snackbarMessage,
      snackbarColor,
      createNewPlan,
      openImportDialog,
      handleImport
    };
  }
});
</script>

<style>
.v-application {
  font-family: 'Roboto', sans-serif;
}

.v-container {
  max-width: 1200px;
}
</style>
