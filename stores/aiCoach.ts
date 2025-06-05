import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useWorkoutsStore } from "./workouts";
import { useRoutinesStore } from "./routines";
import type { AIMessage } from '~/types'

type MessageRole = AIMessage['role']

export const useAICoachStore = defineStore("aiCoach", () => {
  const messages = ref<AIMessage[]>([]);
  const isLoading = ref(false);
  const error = ref<string>("");

  const workoutsStore = useWorkoutsStore();
  const routinesStore = useRoutinesStore();

  function addMessage(role: MessageRole, content: string): void {
    messages.value.push({
      role,
      content,
      timestamp: Date.now()
    });
  }

  function clearMessages(): void {
    messages.value = [];
    error.value = "";
  }

  const getWorkoutContext = computed(() => {
    if (!workoutsStore.recentWorkouts) return '';
    return workoutsStore.recentWorkouts.workouts
      .map(w => `Workout: ${w.title} (${w.start_time})`)
      .join('\n');
  });

  const getRoutineContext = computed(() => {
    if (!routinesStore.routines) return '';
    return routinesStore.routines.routines
      .map(r => `Routine: ${r.title} (${r.exercises.length} exercises)`)
      .join('\n');
  });

  return {
    messages,
    isLoading,
    error,
    addMessage,
    clearMessages,
    getWorkoutContext,
    getRoutineContext
  };
});