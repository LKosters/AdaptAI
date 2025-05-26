<template>
  <div>
    <NuxtLink class="flex items-center gap-2 mb-5" to="/settings">
      <Icon name="line-md:cog-filled" class="!size-5" />
      Instellingen
    </NuxtLink>
    <BlockHero title="Alle workouts" />
    <p class="text-lg font-bold mb-5">Maak een nieuwe workout aan met AI</p>
    <NuxtLink to="/workouts/create" class="btn-primary">
      Routine aanmaken
    </NuxtLink>
    <div class="mb-20 mt-5">
      <div v-if="isLoading" class="text-center py-8">
        <Icon name="line-md:loading-twotone-loop" class="!size-8" />
        <p class="mt-2">Workouts laden...</p>
      </div>
      <div v-else-if="!integrationStore.hevyApiKey" class="text-center py-8">
        <p class="text-gray-400">
          Voeg eerst een Hevy API key toe in de instellingen om je workouts te
          zien.
        </p>
      </div>
      <div
        v-else-if="allWorkouts?.data?.workouts?.length === 0"
        class="text-center py-8"
      >
        <p class="text-gray-400">Geen workouts gevonden.</p>
      </div>
      <div
        v-else
        class="mb-4 bg-[#282828]/70 p-4 rounded-[20px]"
        v-for="workout in allWorkouts?.workouts"
        :key="workout.id"
      >
        <p class="font-bold mb-2">{{ workout.title }}</p>
        <p v-if="workout.description" class="mb-2">{{ workout.description }}</p>
        <div
          class="flex items-center gap-5"
          v-if="workout.start_time && workout.end_time"
        >
          <p class="text-sm text-gray-400 flex items-center gap-2">
            <Icon name="line-md:speed" class="!size-5" />
            {{ calculateDuration(workout.start_time, workout.end_time) }}
          </p>
          <p class="text-sm text-gray-400 flex items-center gap-2">
            <Icon name="line-md:calendar" class="!size-5" />
            {{ formatDate(workout.created_at) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { formatDate, isToday, formatDateRange } = useFormatDate();
const integrationStore = useIntegrationStore();

interface Workout {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  created_at?: string;
}

interface WorkoutResponse {
  data: {
    workouts: Workout[];
  };
}

const allWorkouts = ref<WorkoutResponse | null>(null);
const isLoading = ref(false);

const fetchWorkouts = async () => {
  if (!integrationStore.hevyApiKey) {
    allWorkouts.value = null;
    return;
  }

  isLoading.value = true;
  try {
    const data = await $fetch(
      `/api/workouts/recent/${integrationStore.hevyApiKey}`,
    );
    allWorkouts.value = data as WorkoutResponse;
    console.log("Fetched workouts:", data);
  } catch (error) {
    console.error("Error fetching workouts:", error);
    allWorkouts.value = null;
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => integrationStore.hevyApiKey,
  async (newApiKey) => {
    console.log("API key changed:", newApiKey);
    if (newApiKey) {
      await fetchWorkouts();
    } else {
      allWorkouts.value = null;
    }
  },
  { immediate: true },
);

function calculateDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = Math.floor(durationMs / (1000 * 60));

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  if (hours > 0) {
    return `${hours}u ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}
</script>
