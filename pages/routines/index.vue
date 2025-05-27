<template>
  <div>
    <NuxtLink class="flex items-center gap-2 mb-5" to="/settings">
      <Icon name="line-md:cog-filled" class="!size-5" />
      Instellingen
    </NuxtLink>
    <BlockHero title="Alle routines" />
    <p class="text-lg font-bold mb-5">Maak een nieuwe routine aan met AI</p>
    <NuxtLink to="/routines/create" class="btn-primary">
      Routine aanmaken
    </NuxtLink>
    <div class="mb-20 mt-5">
      <div v-if="isLoading" class="text-center py-8">
        <Icon name="line-md:loading-twotone-loop" class="!size-8" />
        <p class="mt-2">Routines laden...</p>
      </div>
      <div v-else-if="!integrationStore.hevyApiKey" class="text-center py-8">
        <p class="text-gray-400">
          Voeg eerst een Hevy API key toe in de instellingen om je routines te
          zien.
        </p>
      </div>
      <div
        v-else-if="allRoutines?.routines?.length === 0"
        class="text-center py-8"
      >
        <p class="text-gray-400">Geen routines gevonden.</p>
      </div>
      <div
        v-else
        class="mb-4 bg-[#282828]/70 p-4 rounded-[20px]"
        v-for="routine in allRoutines?.routines"
        :key="routine.id"
      >
        <p class="font-bold mb-2">{{ routine.title }}</p>
        <div class="flex items-center gap-5">
          <p class="text-sm text-gray-400 flex items-center gap-2">
            <Icon name="line-md:pencil" class="!size-5" />
            {{ routine.exercises?.length || 0 }} oefeningen
          </p>
          <p class="text-sm text-gray-400 flex items-center gap-2">
            <Icon name="line-md:calendar" class="!size-5" />
            {{ formatDate(routine.created_at) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { formatDate, isToday, formatDateRange } = useFormatDate();
const integrationStore = useIntegrationStore();
const routinesStore = useRoutinesStore();

// Use the store's data and loading state
const allRoutines = computed(() => routinesStore.routines);
const isLoading = computed(() => routinesStore.isLoading);

// Fetch routines on mount
onMounted(() => {
  routinesStore.fetchRoutines();
});
</script>
