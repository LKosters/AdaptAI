<template>
  <div class="flex items-center gap-4 mb-5">
    <NuxtImg v-if="logo" src="/logo.png" alt="Logo" class="w-20 h-20" />
    <h1 class="text-3xl font-bold">{{ title }}</h1>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  logo: {
    type: Boolean,
  },
});
</script>
