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

    const now = new Date();

    const getMondayOfWeek = (date: Date) => {
      const d = new Date(date);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      return new Date(d.setDate(diff));
    };

    const currentMonday = getMondayOfWeek(now);
    const weekLabels: string[] = [];
    const workoutCounts: number[] = [];

    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(
        currentMonday.getTime() - i * 7 * 24 * 60 * 60 * 1000,
      );
      const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);

      const startDay = weekStart.getDate().toString().padStart(2, "0");
      const startMonth = (weekStart.getMonth() + 1).toString().padStart(2, "0");
      const endDay = weekEnd.getDate().toString().padStart(2, "0");
      const endMonth = (weekEnd.getMonth() + 1).toString().padStart(2, "0");

      const weekLabel = `${startDay}/${startMonth} - ${endDay}/${endMonth}`;
      weekLabels.push(weekLabel);

      const workoutsInWeek = props.workouts.filter((workout: any) => {
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

    if (chart) {
      chart.destroy();
    }

    const ctx = chartCanvas.value.getContext("2d");
    if (!ctx) return;

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
            borderWidth: 3,
            pointBackgroundColor: "#f47816",
            pointBorderColor: "#f47816",
            pointRadius: 5,
            pointHoverRadius: 8,
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
    console.error("Error creating workouts per week chart:", error);
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
