<template>
  <div>
    <div>
      <NuxtLink class="flex items-center gap-2 mb-5" to="/workouts">
        <Icon name="line-md:arrow-left" class="!size-5" />
        Alle workouts
      </NuxtLink>
      <BlockHero title="Routine aanmaken" />
      <p class="text-lg font-bold mb-5">
        Wat voor een workout zou je willen maken?
      </p>
      <textarea
        placeholder="Een legday waar je benen van afbreken!"
        class="input mb-3"
        type="text"
        v-model="input"
      />
      <button
        @click="generateContent"
        :class="{ 'opacity-50 pointer-events-none': isLoading }"
        class="btn-primary mb-5"
        :disabled="isLoading"
      >
        <Icon v-if="isLoading" name="line-md:loading-twotone-loop" />
        <span v-else>Submit</span>
      </button>
      <button
        v-if="workout"
        @click="saveWorkout"
        :class="{ 'opacity-50 pointer-events-none': isLoading }"
        class="btn-primary mb-5"
        :disabled="isLoading"
      >
        <Icon v-if="isLoading" name="line-md:loading-twotone-loop" />
        <span v-else>Workout opslaan</span>
      </button>
      <div class="mb-20" v-if="workout">
        <p class="font-bold text-lg mb-5">{{ workout.routine.title }}</p>
        <div
          class="mb-4 bg-[#282828]/70 p-4 rounded-[20px]"
          v-for="exercise in workout.routine.exercises"
          :key="exercise.exercise_template_id"
        >
          <p class="font-bold mb-2">{{ exercise.exercise_template_id }}</p>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FirebaseApp } from "firebase/app";
import type {
  ChatSession,
  FileDataPart,
  GenerationConfig,
  GenerativeModel,
  Content,
  HarmBlockThreshold,
  HarmCategory,
  InlineDataPart,
  Part,
  SafetySetting,
} from "firebase/ai";
import { getGenerativeModel, getAI } from "firebase/ai";

interface WorkoutSet {
  id?: string | number;
  type: string;
  weight_kg: number;
  reps: number;
  distance_meters?: number;
  duration_seconds?: number;
  custom_metric?: any;
}

interface Exercise {
  exercise_template_id: string;
  superset_id?: string;
  rest_seconds: number;
  notes: string;
  sets: WorkoutSet[];
}

interface WorkoutRoutine {
  title: string;
  folder_id?: string;
  notes: string;
  exercises: Exercise[];
}

interface Workout {
  routine: WorkoutRoutine;
}

const input = ref("");
const result = ref("");
const workout = ref<Workout | null>(null);
const isLoading = ref(false);
const integrationStore = useIntegrationStore();

async function generateContent() {
  isLoading.value = true;

  try {
    const workoutTemplates = await $fetch("/workout_templates.json");
    
    // Fetch recent workouts for personalization
    let recentWorkouts = null;
    if (integrationStore.hevyApiKey) {
      try {
        recentWorkouts = await $fetch(`/api/workouts/recent/${integrationStore.hevyApiKey}`);
      } catch (error) {
        console.warn("Could not fetch recent workouts:", error);
      }
    }

    const { $firebaseApp } = useNuxtApp();

    const generationConfig: GenerationConfig = {
      responseMimeType: "text/plain",
    };
    
    const recentWorkoutsContext = recentWorkouts 
      ? `\n\nUser's recent workouts for personalization:\n${JSON.stringify(recentWorkouts, null, 2)}`
      : "\n\nNo recent workout data available.";
    
    const systemInstruction: Content = {
      role: "system",
      parts: [
        {
          text: `(dont add workouts that have duration only sets and reps) can you create a gym routine for the thing the user has given context/input and based on the json response of the users recent workouts, give me as result a json response that i can import into my app. Use the exercise template IDs from the available workout templates below.

Available workout templates:
${JSON.stringify(workoutTemplates, null, 2)}${recentWorkoutsContext}

The response must look like this for example:

{ "routine": { "title": "April Leg Day 🔥", "folder_id": null, "notes": "Focus on form over weight. Remember to stretch.", "exercises": [ { "exercise_template_id": "D04AC939", "superset_id": null, "rest_seconds": 90, "notes": "Stay slow and controlled.", "sets": [ { "type": "normal", "weight_kg": 100, "reps": 10, "distance_meters": null, "duration_seconds": null, "custom_metric": null }

]

}

]

}

}`,
        },
      ],
    };

    const ai = getAI($firebaseApp as FirebaseApp);
    const model = getGenerativeModel(ai, {
      model: "gemini-2.5-flash-preview-05-20",
      generationConfig,
      systemInstruction,
    });
    const message: Content = {
      role: "user",
      parts: [{ text: input.value }],
    };

    const chat = model.startChat();

    const response = await chat.sendMessage(message.parts);
    result.value = response.response.text();

    const json = result.value.match(/```json\n(.*)\n```/s);
    console.log(json);

    if (json && json[1]) {
      workout.value = JSON.parse(json[1]);
      console.log(workout.value);
    }
  } catch (error) {
    console.error("Error generating workout:", error);
  } finally {
    isLoading.value = false;
  }
}

async function saveWorkout() {
  if (!workout.value || !integrationStore.hevyApiKey) {
    console.error("No workout to save or missing API key");
    return;
  }

  isLoading.value = true;

  try {
    const response = await $fetch(
      `/api/workouts/create/${integrationStore.hevyApiKey}`,
      {
        method: "POST",
        body: workout.value,
      },
    );

    console.log("Workout saved successfully:", response);
  } catch (error) {
    console.error("Error saving workout:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>
