<template>
  <div>
    <div class="flex items-center justify-between gap-2 mb-5 relative">
      <NuxtLink v-if="link" class="flex items-center gap-2" :to="link.link">
      <Icon :name="link.icon" class="!size-5" />
      {{ link.title }}
    </NuxtLink>
    <button v-if="single" class="flex items-center gap-2 cursor-pointer" @click="invokeMenu = !invokeMenu">
      <Icon v-if="invokeMenu" name="line-md:menu-to-close-alt-transition" class="!size-5" />
      <Icon v-else name="line-md:close-to-menu-alt-transition" class="!size-5" />
    </button>
    <div v-if="invokeMenu" class="absolute right-0 top-8 bg-white p-2 rounded-lg text-black">
      <button @click="deleteRoutine" class="flex items-center gap-2 cursor-pointer text-sm text-primary">
        <Icon name="line-md:trash" class="!size-5" />
        Verwijder routine
      </button>
    </div>
    </div>
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
  single: {
    type: String,
  },
  logo: {
    type: Boolean,
  },
  link: {
    type: Object,
  },
});

const invokeMenu = ref(false);

const emit = defineEmits(['deleteRoutine']);

const deleteRoutine = () => {
  emit('deleteRoutine');
}
</script>
