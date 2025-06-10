<template>
  <div>
    <BlockHero
      :link="{
        link: '/settings',
        title: 'Instellingen',
        icon: 'line-md:cog-filled',
      }"
      title="Statistieken"
    />

    <div v-if="isLoading" class="text-center py-8">
      <Icon name="line-md:loading-twotone-loop" class="!size-8" />
      <p class="mt-2">Statistieken laden...</p>
    </div>

    <div v-else-if="!integrationStore.hevyApiKey" class="text-center py-8">
      <p class="text-gray-400">
        Voeg eerst een Hevy API key toe in de instellingen om je statistieken te
        zien.
      </p>
    </div>

    <div v-else-if="!allWorkouts?.workouts?.length" class="text-center py-8">
      <p class="text-gray-400">Geen workouts gevonden voor statistieken.</p>
    </div>

    <div v-else class="space-y-8 mb-20">
      <!-- Workouts per week chart -->
      <div class="bg-[#282828]/70 p-6 rounded-[20px]">
        <h3 class="text-xl font-bold mb-4">Workouts per Week</h3>
        <ClientOnly>
          <UiGraphWorkoutsPerWeekChart :workouts="allWorkouts.workouts" />
          <template #fallback>
            <div class="h-[300px] flex items-center justify-center">
              <p class="text-gray-400">Chart laden...</p>
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Muscle Groups Distribution -->
      <div class="bg-[#282828]/70 p-6 rounded-[20px]">
        <h3 class="text-xl font-bold mb-4">Spiergroepen Verdeling</h3>
        <ClientOnly>
          <UiGraphMuscleGroupsChart
            :workouts="allWorkouts.workouts"
            :exercise-templates="exerciseTemplates"
          />
          <template #fallback>
            <div class="h-[200px] flex items-center justify-center">
              <p class="text-gray-400">Chart laden...</p>
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Equipment Usage -->
      <div class="bg-[#282828]/70 p-6 rounded-[20px]">
        <h3 class="text-xl font-bold mb-4">Apparatuur Gebruik</h3>
        <ClientOnly>
          <UiGraphEquipmentChart
            :workouts="allWorkouts.workouts"
            :exercise-templates="exerciseTemplates"
          />
          <template #fallback>
            <div class="h-[300px] flex items-center justify-center">
              <p class="text-gray-400">Chart laden...</p>
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Workout Duration Trends -->
      <div class="bg-[#282828]/70 p-6 rounded-[20px]">
        <h3 class="text-xl font-bold mb-4">Workout Duur Trends</h3>
        <ClientOnly>
          <UiGraphDurationTrendsChart :workouts="allWorkouts.workouts" />
          <template #fallback>
            <div class="h-[300px] flex items-center justify-center">
              <p class="text-gray-400">Chart laden...</p>
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Top Exercises -->
      <div class="bg-[#282828]/70 p-6 rounded-[20px]">
        <h3 class="text-xl font-bold mb-4">Meest Gebruikte Oefeningen</h3>
        <ClientOnly>
          <UiGraphTopExercisesChart
            :workouts="allWorkouts.workouts"
            :exercise-templates="exerciseTemplates"
          />
          <template #fallback>
            <div class="h-[400px] flex items-center justify-center">
              <p class="text-gray-400">Chart laden...</p>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const integrationStore = useIntegrationStore();
const workoutsStore = useWorkoutsStore();
const routinesStore = useRoutinesStore();

// Exercise templates data
const exerciseTemplates = ref<any>(null);

// Computed properties
const allWorkouts = computed(() => workoutsStore.recentWorkouts);
const allRoutines = computed(() => routinesStore.routines);
const isLoading = computed(
  () => workoutsStore.isLoading || routinesStore.isLoading,
);

// Load exercise templates and fetch data
onMounted(async () => {
  try {
    exerciseTemplates.value = await $fetch("/workout_templates.json");
  } catch (error) {
    console.error("Error loading exercise templates:", error);
  }

  // Fetch data
  await Promise.all([
    workoutsStore.fetchRecentWorkouts(),
    routinesStore.fetchRoutines(),
  ]);
});
</script>
