<template>
  <div class="mb-20">
    <div v-if="isLoading" class="loading">Loading workout...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="workout">
      <NuxtLink class="flex items-center gap-2 mb-5" to="/">
        <Icon name="line-md:arrow-left" class="!size-5" />
        Terug naar home
      </NuxtLink>
      <BlockHero :title="workout.title" />

      <div class="flex items-center gap-5 mb-5">
        <p class="text-sm text-gray-400 flex items-center gap-2">
          <Icon name="line-md:speed" class="!size-5" />
          {{ calculateDuration(workout.start_time, workout.end_time) }}
        </p>
        <p class="text-sm text-gray-400 flex items-center gap-2">
          <Icon name="line-md:calendar" class="!size-5" />
          {{ formatDate(workout.created_at) }}
        </p>
      </div>

      <div
        class="mb-4 bg-[#282828]/70 p-4 rounded-[20px]"
        v-for="exercise in workout.exercises"
        :key="exercise.exercise_template_id"
      >
        <p class="font-bold mb-2">
          {{ exercise.title }}
        </p>
        <p class="mb-2">{{ exercise.notes }}</p>
        <div>
          <p v-for="set in exercise.sets" :key="set.id">
            <span v-if="set.weight_kg || set.reps">
              {{ set.weight_kg }}KG - {{ set.reps }} reps
            </span>
            <span v-else> {{ set.duration_seconds }} seconds </span>
          </p>
        </div>
      </div>
    </div>

    <div v-else>Workout not found</div>
  </div>
</template>

<script lang="ts" setup>
const { formatDate, isToday, formatDateRange } = useFormatDate();

const route = useRoute();
const workoutsStore = useWorkoutsStore();

const workoutId = route.params.id as string;

const workout = computed(() => {
  if (!workoutsStore.recentWorkouts?.workouts) return null;
  return workoutsStore.recentWorkouts.workouts.find((r) => r.id === workoutId);
});

const isLoading = computed(() => workoutsStore.isLoading);
const error = computed(() => workoutsStore.error);

// Fetch routines if not already loaded
onMounted(async () => {
  if (!workoutsStore.recentWorkouts || workoutsStore.shouldRefetch) {
    await workoutsStore.fetchRecentWorkouts();
  }
});

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
