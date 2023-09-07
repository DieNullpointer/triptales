<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  msg: string;
}

defineProps<Props>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button class="text-lg" type="button" @click="count++">count is {{ count }}</button>
  </div>
</template>
