<template>
    <div>
        <h1>Create Workout</h1>
        <input type="text" v-model="input" />
        <button @click="generateContent">Generate</button>
        <pre>{{ result }}</pre>
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
import {
  getGenerativeModel,
  getAI,
} from "firebase/ai";

const input = ref("");
const result = ref("");

async function generateContent() {
  const { $firebaseApp } = useNuxtApp();
  
  const generationConfig: GenerationConfig = {
    responseMimeType: "text/plain",
  };
  const systemInstruction: Content = {
    role: "system",
    parts: [{ text: "can you create a gym routine for the thing the user has given context/input and based on the json response of the users recent workouts, give me as result a json response that i can import into my app, it must look like this for example:\n\n{ \"routine\": { \"title\": \"April Leg Day 🔥\", \"folder_id\": null, \"notes\": \"Focus on form over weight. Remember to stretch.\", \"exercises\": [ { \"exercise_template_id\": \"D04AC939\", \"superset_id\": null, \"rest_seconds\": 90, \"notes\": \"Stay slow and controlled.\", \"sets\": [ { \"type\": \"normal\", \"weight_kg\": 100, \"reps\": 10, \"distance_meters\": null, \"duration_seconds\": null, \"custom_metric\": null }\n\n]\n\n}\n\n]\n\n}\n\n}" }],
  };

  const ai = getAI($firebaseApp as FirebaseApp);
  const model = getGenerativeModel(ai, {
    model: "gemini-2.5-flash-preview-05-20",
    generationConfig,
    systemInstruction,
  });
  const message: Content = {
    role: "user",
    parts: [
      { text: input.value },
    ],
  };

  const chat = model.startChat();

  const response = await chat.sendMessage(message.parts);
  result.value = response.response.text();
}
</script>
