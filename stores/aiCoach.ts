import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useWorkoutsStore } from "./workouts";
import { useRoutinesStore } from "./routines";
import type { Ref } from "vue";

type MessageRole = any;

export const useAICoachStore = defineStore("aiCoach", () => {
  const messages: Ref<any[]> = ref<any[]>([]);
  const isLoading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  const workoutsStore = useWorkoutsStore();
  const routinesStore = useRoutinesStore();

  function addMessage(role: MessageRole, content: string): void {
    messages.value.push({
      role,
      content,
      timestamp: Date.now(),
    });
  }

  function clearMessages(): void {
    messages.value = [];
    error.value = null;
  }

  function setError(message: string | null): void {
    error.value = message;
  }

  function setLoading(value: boolean): void {
    isLoading.value = value;
  }

  const getWorkoutContext = computed(() => {
    if (!workoutsStore.recentWorkouts) return "";
    return workoutsStore.recentWorkouts.workouts
      .map((w) => `Workout: ${w.title} (${w.start_time})`)
      .join("\n");
  });

  const getRoutineContext = computed(() => {
    if (!routinesStore.routines) return "";
    return routinesStore.routines.routines
      .map((r) => `Routine: ${r.title} (${r.exercises.length} exercises)`)
      .join("\n");
  });

  return {
    messages,
    isLoading,
    error,
    addMessage,
    clearMessages,
    setError,
    setLoading,
    getWorkoutContext,
    getRoutineContext,
  };
});
