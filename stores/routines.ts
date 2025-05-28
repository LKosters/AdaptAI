import { defineStore } from "pinia";

interface Set {
  index: number;
  type: string;
  weight_kg: number | null;
  reps: number | null;
  distance_meters: number | null;
  duration_seconds: number | null;
  custom_metric: string | null;
}

interface Exercise {
  index: number;
  title: string;
  notes: string;
  exercise_template_id: string;
  superset_id: string | null;
  sets: Set[];
  rest_seconds: number;
}

interface Routine {
  id: string;
  title: string;
  folder_id: string | null;
  updated_at: string;
  created_at: string;
  exercises: Exercise[];
}

interface RoutineResponse {
  page: number;
  page_count: number;
  routines: Routine[];
}

export const useRoutinesStore = defineStore("routines", () => {
  const routines = ref<RoutineResponse | null>(null);
  const isLoading = ref(false);
  const error = ref<string>("");
  const lastFetchTime = ref<number>(0);
  const cacheExpiry = 5 * 60 * 1000; // 5 minutes cache

  const integrationStore = useIntegrationStore();

  const shouldRefetch = computed(() => {
    const now = Date.now();
    return now - lastFetchTime.value > cacheExpiry;
  });

  const fetchRoutines = async (forceRefresh = false) => {
    if (!integrationStore.hevyApiKey) {
      routines.value = null;
      return;
    }

    // Return cached data if available and not expired
    if (!forceRefresh && routines.value && !shouldRefetch.value) {
      return routines.value;
    }

    isLoading.value = true;
    error.value = "";

    try {
      const data = await $fetch(
        `/api/workouts/routines/${integrationStore.hevyApiKey}`,
      );
      routines.value = data as RoutineResponse;
      lastFetchTime.value = Date.now();
      console.log("Fetched routines:", data);
    } catch (err) {
      console.error("Error fetching routines:", err);
      error.value = "Failed to fetch routines";
      routines.value = null;
    } finally {
      isLoading.value = false;
    }

    return routines.value;
  };

  const clearRoutines = () => {
    routines.value = null;
    lastFetchTime.value = 0;
    error.value = "";
  };

  const refreshRoutines = () => {
    return fetchRoutines(true);
  };

  // Watch for API key changes and clear cache
  watch(
    () => integrationStore.hevyApiKey,
    (newApiKey, oldApiKey) => {
      if (newApiKey !== oldApiKey) {
        clearRoutines();
        if (newApiKey) {
          fetchRoutines();
        }
      }
    },
  );

  return {
    routines: readonly(routines),
    isLoading: readonly(isLoading),
    error: readonly(error),
    shouldRefetch: readonly(shouldRefetch),
    fetchRoutines,
    clearRoutines,
    refreshRoutines,
  };
});
