<template>
  <div class="mb-20">
    <div v-if="isLoading" class="loading">Loading routine...</div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="routine">
      <BlockHero @deleteRoutine="deleteRoutine" :single="routineId" :link="{ link: '/routines', title: 'Alle routines', icon: 'line-md:arrow-left'}" :title="routine.title" />

      <div class="flex items-center gap-5 mb-5">
        <p class="text-sm text-gray-400 flex items-center gap-2">
          <Icon name="line-md:pencil" class="!size-5" />
          {{ routine.exercises?.length || 0 }} oefeningen
        </p>
        <p class="text-sm text-gray-400 flex items-center gap-2">
          <Icon name="line-md:calendar" class="!size-5" />
          {{ formatDate(routine.created_at) }}
        </p>
      </div>

      <div
        class="mb-4 bg-[#282828]/70 p-4 rounded-[20px]"
        v-for="exercise in routine.exercises"
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

    <div v-else>Routine not found</div>
  </div>
</template>

<script lang="ts" setup>
const { formatDate, isToday, formatDateRange } = useFormatDate();

const route = useRoute();
const routinesStore = useRoutinesStore();

const routineId = route.params.id as string;

const routine = computed(() => {
  if (!routinesStore.routines?.routines) return null;
  return routinesStore.routines.routines.find((r) => r.id === routineId);
});

const isLoading = computed(() => routinesStore.isLoading);
const error = computed(() => routinesStore.error);

// Fetch routines if not already loaded
onMounted(async () => {
  if (!routinesStore.routines || routinesStore.shouldRefetch) {
    await routinesStore.fetchRoutines();
  }
});

const deleteRoutine = () => {
  console.log('delete');
}
</script>
