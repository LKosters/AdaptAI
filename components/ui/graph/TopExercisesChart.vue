<template>
  <div class="h-[400px]">
    <canvas ref="chartCanvas" class="w-full h-full"></canvas>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  workouts: any[]
  exerciseTemplates: any
}

const props = defineProps<Props>()

const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chart: any = null

const createChart = async () => {
  if (!process.client || !chartCanvas.value || !props.workouts?.length || !props.exerciseTemplates) return

  try {
    const {
      Chart,
      CategoryScale,
      LinearScale,
      BarElement,
      BarController,
      Title,
      Tooltip,
      Legend,
    } = await import('chart.js')

    Chart.register(
      CategoryScale,
      LinearScale,
      BarElement,
      BarController,
      Title,
      Tooltip,
      Legend,
    )

    const exerciseCounts: { [key: string]: number } = {}
    
    const exerciseMap: { [key: string]: any } = {}
    props.exerciseTemplates.exercise_templates?.forEach((template: any) => {
      exerciseMap[template.id] = template
    })

    props.workouts.forEach((workout: any) => {
      if (workout.exercises) {
        workout.exercises.forEach((exercise: any) => {
          const template = exerciseMap[exercise.exercise_template_id]
          if (template) {
            exerciseCounts[template.title] = (exerciseCounts[template.title] || 0) + 1
          }
        })
      }
    })

    const sortedExercises = Object.entries(exerciseCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)

    if (chart) {
      chart.destroy()
    }

    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) return

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedExercises.map(([name]) => name),
        datasets: [{
          label: 'Gebruik',
          data: sortedExercises.map(([, count]) => count),
          backgroundColor: '#8b5cf6',
          borderColor: '#7c3aed',
          borderWidth: 1,
        }],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: '#8b5cf6',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: 'rgba(156, 163, 175, 1)',
            },
            grid: {
              color: 'rgba(75, 85, 99, 0.3)',
            },
          },
          y: {
            ticks: {
              color: 'rgba(156, 163, 175, 1)',
              font: {
                size: 11,
              },
            },
            grid: {
              display: false,
            },
          },
        },
      },
    })
  } catch (error) {
    console.error('Error creating top exercises chart:', error)
  }
}

watch([() => props.workouts, () => props.exerciseTemplates], () => {
  if (process.client) {
    nextTick(() => {
      createChart()
    })
  }
}, { immediate: true })

onMounted(() => {
  if (process.client) {
    nextTick(() => {
      createChart()
    })
  }
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
  }
})
</script> 