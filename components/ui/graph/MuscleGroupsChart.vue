<template>
  <div class="h-[200px]">
    <canvas ref="chartCanvas" class="w-full h-full"></canvas>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  workouts: any[];
  exerciseTemplates: any;
}

const props = defineProps<Props>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: any = null;

const createChart = async () => {
  if (
    !process.client ||
    !chartCanvas.value ||
    !props.workouts?.length ||
    !props.exerciseTemplates
  )
    return;

  try {
    const { Chart, DoughnutController, ArcElement, Title, Tooltip, Legend } =
      await import("chart.js");

    Chart.register(DoughnutController, ArcElement, Title, Tooltip, Legend);

    const muscleGroupCounts: { [key: string]: number } = {};

    const exerciseMap: { [key: string]: any } = {};
    props.exerciseTemplates.exercise_templates?.forEach((template: any) => {
      exerciseMap[template.id] = template;
    });

    props.workouts.forEach((workout: any) => {
      if (workout.exercises) {
        workout.exercises.forEach((exercise: any) => {
          const template = exerciseMap[exercise.exercise_template_id];
          if (template) {
            const primaryMuscle = template.primary_muscle_group;
            muscleGroupCounts[primaryMuscle] =
              (muscleGroupCounts[primaryMuscle] || 0) + 1;

            template.secondary_muscle_groups?.forEach((secondary: string) => {
              muscleGroupCounts[secondary] =
                (muscleGroupCounts[secondary] || 0) + 0.5;
            });
          }
        });
      }
    });

    const sortedMuscleGroups = Object.entries(muscleGroupCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    const muscleGroupColors = [
      "#f47816",
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#54a0ff",
      "#5f27cd",
      "#00d2d3",
    ];

    if (chart) {
      chart.destroy();
    }

    const ctx = chartCanvas.value.getContext("2d");
    if (!ctx) return;

    chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: sortedMuscleGroups.map(([name]) =>
          name.replace("_", " ").toUpperCase(),
        ),
        datasets: [
          {
            data: sortedMuscleGroups.map(([, count]) => Math.round(count)),
            backgroundColor: muscleGroupColors,
            borderColor: "#1f2937",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "rgba(156, 163, 175, 1)",
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "#f47816",
            borderWidth: 1,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error creating muscle groups chart:", error);
  }
};

watch(
  [() => props.workouts, () => props.exerciseTemplates],
  () => {
    if (process.client) {
      nextTick(() => {
        createChart();
      });
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (process.client) {
    nextTick(() => {
      createChart();
    });
  }
});

onUnmounted(() => {
  if (chart) {
    chart.destroy();
  }
});
</script>
