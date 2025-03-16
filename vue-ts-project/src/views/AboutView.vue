<template>
  <v-container>
    <h1>About Us</h1>
    <p>This is the about page of our Vue.js application.</p>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AboutView',
});
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>