<template>
  <div>
    <BlockHero logo :title="welcomeMessage" />
    <p class="text-lg font-bold mb-5">Recente activiteiten</p>
    <div class="mb-8 min-h-[200px] bg-[#282828]/70 p-4 rounded-[20px]">
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
        v-else-if="allWorkouts?.workouts?.length === 0"
        class="text-center py-8"
      >
        <p class="text-gray-400">Geen workouts gevonden.</p>
      </div>
      <div v-else class="h-[150px] relative">
        <ClientOnly>
          <div class="h-full">
            <p class="text-sm text-gray-400 mb-2">
              Workouts per week (laatste 4 weken)
            </p>
            <div class="h-[120px]">
              <canvas ref="chartCanvas" class="w-full h-full"></canvas>
            </div>
          </div>
          <template #fallback>
            <div class="text-center py-8">
              <p class="text-gray-400">Chart laden...</p>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
    <p class="text-lg font-bold mb-5">Recente workouts</p>
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
        v-else-if="allWorkouts?.workouts?.length === 0"
        class="text-center py-8"
      >
        <p class="text-gray-400">Geen workouts gevonden.</p>
      </div>
      <NuxtLink
        v-else
        :to="`/workout/${workout.id}`"
        class="mb-4 block bg-[#282828]/70 p-4 rounded-[20px]"
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
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { isLoaded, isSignedIn, user } = useUser();

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const welcomeMessage = computed(() => {
  if (!isLoaded.value) {
    return "Laden...";
  }

  if (!isSignedIn.value) {
    return "Welkom";
  }

  const displayName =
    user.value?.firstName ||
    user.value?.fullName ||
    user.value?.primaryEmailAddress?.emailAddress ||
    "gebruiker";

  return `Welkom terug, ${capitalizeFirstLetter(displayName)}`;
});

const { formatDate, isToday, formatDateRange } = useFormatDate();
const integrationStore = useIntegrationStore();
const workoutsStore = useWorkoutsStore();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: any = null;

// Use the store's data and loading state
const allWorkouts = computed(() => workoutsStore.recentWorkouts);
const isLoading = computed(() => workoutsStore.isLoading);

// Fetch workouts on mount
onMounted(() => {
  workoutsStore.fetchRecentWorkouts();
  if (process.client) {
    nextTick(() => {
      createWorkoutChart();
    });
  }
});

const createWorkoutChart = async () => {
  if (!process.client) return;

  if (!chartCanvas.value) return;

  if (!allWorkouts.value?.workouts) return;

  try {
    const {
      Chart,
      CategoryScale,
      LinearScale,
      LineElement,
      LineController,
      PointElement,
      Title,
      Tooltip,
      Legend,
    } = await import("chart.js");

    Chart.register(
      CategoryScale,
      LinearScale,
      LineElement,
      LineController,
      PointElement,
      Title,
      Tooltip,
      Legend,
    );

    if (chart) {
      chart.destroy();
      chart = null;
    }

    const workouts = allWorkouts.value.workouts;
    const now = new Date();

    // Get the most recent Monday
    const getMondayOfWeek = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    };

    const currentMonday = getMondayOfWeek(now);

    const weekLabels: string[] = [];
    const workoutCounts: number[] = [];

    // Generate last 4 weeks (including current week)
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(
        currentMonday.getTime() - i * 7 * 24 * 60 * 60 * 1000,
      );
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000); // Sunday of that week

      // Format the label as "dd/mm - dd/mm"
      const startDay = weekStart.getDate().toString().padStart(2, "0");
      const startMonth = (weekStart.getMonth() + 1).toString().padStart(2, "0");
      const endDay = weekEnd.getDate().toString().padStart(2, "0");
      const endMonth = (weekEnd.getMonth() + 1).toString().padStart(2, "0");

      const weekLabel = `${startDay}/${startMonth} - ${endDay}/${endMonth}`;
      weekLabels.push(weekLabel);

      // Count workouts in this week (Monday to Sunday inclusive)
      const workoutsInWeek = workouts.filter((workout: any) => {
        const workoutDate = new Date(
          workout.created_at || workout.start_time || "",
        );
        const workoutDateStart = new Date(
          workoutDate.getFullYear(),
          workoutDate.getMonth(),
          workoutDate.getDate(),
        );
        const weekStartDate = new Date(
          weekStart.getFullYear(),
          weekStart.getMonth(),
          weekStart.getDate(),
        );
        const weekEndDate = new Date(
          weekEnd.getFullYear(),
          weekEnd.getMonth(),
          weekEnd.getDate(),
        );

        return (
          workoutDateStart >= weekStartDate && workoutDateStart <= weekEndDate
        );
      });

      workoutCounts.push(workoutsInWeek.length);
    }

    const ctx = chartCanvas.value.getContext("2d");
    if (!ctx) return;

    await nextTick();

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: weekLabels,
        datasets: [
          {
            label: "Workouts per week",
            data: workoutCounts,
            backgroundColor: "rgba(244, 120, 22, 0.1)",
            borderColor: "#f47816",
            borderWidth: 2,
            pointBackgroundColor: "#f47816",
            pointBorderColor: "#f47816",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "#f47816",
            borderWidth: 1,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: "rgba(156, 163, 175, 1)",
            },
            grid: {
              color: "rgba(75, 85, 99, 0.3)",
            },
          },
          x: {
            ticks: {
              color: "rgba(156, 163, 175, 1)",
              maxRotation: 0,
              minRotation: 0,
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error creating chart:", error);
  }
};

watch(
  () => allWorkouts.value,
  () => {
    if (process.client) {
      nextTick(() => {
        createWorkoutChart();
      });
    }
  },
);

watch(
  () => chartCanvas.value,
  (canvas) => {
    if (canvas && allWorkouts.value?.workouts && process.client) {
      nextTick(() => {
        createWorkoutChart();
      });
    }
  },
);

onUnmounted(() => {
  if (chart) {
    chart.destroy();
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
