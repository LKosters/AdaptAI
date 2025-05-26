<template>
  <div>
    <NuxtLink class="flex items-center gap-2 mb-5" to="/settings">
      <Icon name="line-md:cog-filled" class="!size-5" />
      Instellingen
    </NuxtLink>
    <BlockHero title="Alle workouts" />
    <p class="text-lg font-bold mb-5">Maak een nieuwe workout aan met AI</p>
    <NuxtLink to="/workouts/create" class="btn-primary"> Aanmaken </NuxtLink>
    <div class="mb-20 mt-5">
      <div
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

interface Workout {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
}

interface WorkoutResponse {
  data: {
    workouts: Workout[];
  };
}

const allWorkouts = ref<WorkoutResponse | null>(null);

const { data } = await useFetch("/api/workouts/recent/");
allWorkouts.value = data.value as WorkoutResponse;

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
