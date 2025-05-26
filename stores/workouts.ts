import { defineStore } from "pinia";

interface Workout {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  created_at?: string;
}

interface WorkoutResponse {
  workouts: Workout[];
}

export const useWorkoutsStore = defineStore("workouts", () => {
  const recentWorkouts = ref<WorkoutResponse | null>(null);
  const isLoading = ref(false);
  const error = ref<string>("");
  const lastFetchTime = ref<number>(0);
  const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache

  const integrationStore = useIntegrationStore();

  const shouldRefetch = computed(() => {
    const now = Date.now();
    return now - lastFetchTime.value > cacheExpiry;
  });

  const fetchRecentWorkouts = async (forceRefresh = false) => {
    if (!integrationStore.hevyApiKey) {
      recentWorkouts.value = null;
      return;
    }

    // Return cached data if available and not expired
    if (!forceRefresh && recentWorkouts.value && !shouldRefetch.value) {
      return recentWorkouts.value;
    }

    isLoading.value = true;
    error.value = "";

    try {
      const data = await $fetch(
        `/api/workouts/recent/${integrationStore.hevyApiKey}`,
      );
      recentWorkouts.value = data as WorkoutResponse;
      lastFetchTime.value = Date.now();
      console.log("Fetched workouts:", data);
    } catch (err) {
      console.error("Error fetching workouts:", err);
      error.value = "Failed to fetch workouts";
      recentWorkouts.value = null;
    } finally {
      isLoading.value = false;
    }

    return recentWorkouts.value;
  };

  const clearWorkouts = () => {
    recentWorkouts.value = null;
    lastFetchTime.value = 0;
    error.value = "";
  };

  const refreshWorkouts = () => {
    return fetchRecentWorkouts(true);
  };

  // Watch for API key changes and clear cache
  watch(
    () => integrationStore.hevyApiKey,
    (newApiKey, oldApiKey) => {
      if (newApiKey !== oldApiKey) {
        clearWorkouts();
        if (newApiKey) {
          fetchRecentWorkouts();
        }
      }
    }
  );

  return {
    recentWorkouts: readonly(recentWorkouts),
    isLoading: readonly(isLoading),
    error: readonly(error),
    shouldRefetch: readonly(shouldRefetch),
    fetchRecentWorkouts,
    clearWorkouts,
    refreshWorkouts,
  };
}); 