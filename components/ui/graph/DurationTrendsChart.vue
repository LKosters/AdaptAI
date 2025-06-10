<template>
  <div class="h-[300px]">
    <canvas ref="chartCanvas" class="w-full h-full"></canvas>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  workouts: any[];
}

const props = defineProps<Props>();

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: any = null;

const createChart = async () => {
  if (!process.client || !chartCanvas.value || !props.workouts?.length) return;

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

    const workoutsWithDuration = props.workouts
      .filter((workout: any) => workout.start_time && workout.end_time)
      .map((workout: any) => ({
        date: new Date(workout.created_at || workout.start_time),
        duration:
          (new Date(workout.end_time).getTime() -
            new Date(workout.start_time).getTime()) /
          (1000 * 60),
        title: workout.title,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-20);

    if (chart) {
      chart.destroy();
    }

    const ctx = chartCanvas.value.getContext("2d");
    if (!ctx) return;

    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: workoutsWithDuration.map((w) =>
          w.date.toLocaleDateString("nl-NL"),
        ),
        datasets: [
          {
            label: "Duur (minuten)",
            data: workoutsWithDuration.map((w) => Math.round(w.duration)),
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            borderColor: "#22c55e",
            borderWidth: 3,
            pointBackgroundColor: "#22c55e",
            pointBorderColor: "#22c55e",
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "#22c55e",
            borderWidth: 1,
            callbacks: {
              title: function (context: any) {
                const index = context[0].dataIndex;
                return workoutsWithDuration[index]?.title || "";
              },
              label: function (context: any) {
                const duration = context.parsed.y;
                const hours = Math.floor(duration / 60);
                const minutes = duration % 60;
                return hours > 0 ? `${hours}u ${minutes}m` : `${minutes}m`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "rgba(156, 163, 175, 1)",
              callback: function (value: any) {
                const hours = Math.floor(value / 60);
                const minutes = value % 60;
                return hours > 0 ? `${hours}u ${minutes}m` : `${minutes}m`;
              },
            },
            grid: {
              color: "rgba(75, 85, 99, 0.3)",
            },
          },
          x: {
            ticks: {
              color: "rgba(156, 163, 175, 1)",
              maxRotation: 45,
              minRotation: 45,
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error creating duration trends chart:", error);
  }
};

watch(
  () => props.workouts,
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
