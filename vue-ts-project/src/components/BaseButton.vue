<template>
  <button class="base-button" :class="buttonClass" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'BaseButton',
  props: {
    buttonClass: {
      type: String as PropType<string>,
      default: ''
    }
  }
});
</script>

<style scoped>
.base-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
</style>