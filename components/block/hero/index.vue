<template>
  <div>
    <NuxtLink v-if="link" class="flex items-center gap-2 mb-5" :to="link.link">
      <Icon :name="link.icon" class="!size-5" />
      {{ link.title }}
    </NuxtLink>
    <div class="flex items-center gap-4 mb-5">
    <NuxtImg v-if="logo" src="/logo.png" alt="Logo" class="w-20 h-20" />
    <h1 class="text-3xl font-bold">{{ title }}</h1>
  </div>
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
  link: {
    type: Object,
  },
});
</script>
