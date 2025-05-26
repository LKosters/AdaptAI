import { FirebaseApp } from "firebase/app";
import {
  ChatSession,
  FileDataPart,
  GenerationConfig,
  GenerativeModel,
  Content,
  getGenerativeModel,
  getAI,
  HarmBlockThreshold,
  HarmCategory,
  InlineDataPart,
  Part,
  SafetySetting,
} from "firebase/ai";

async function generateContent(input: string, firebaseApp: FirebaseApp) {
    const generationConfig: GenerationConfig = {
      responseMimeType: "text/plain",
    };
    const systemInstruction: Content = {
      role: "system",
      parts: ["can you create a gym routine for the thing the user has given context/input and based on the json response of the users recent workouts, give me as result a json response that i can import into my app, it must look like this for example:\n\n{ \"routine\": { \"title\": \"April Leg Day 🔥\", \"folder_id\": null, \"notes\": \"Focus on form over weight. Remember to stretch.\", \"exercises\": [ { \"exercise_template_id\": \"D04AC939\", \"superset_id\": null, \"rest_seconds\": 90, \"notes\": \"Stay slow and controlled.\", \"sets\": [ { \"type\": \"normal\", \"weight_kg\": 100, \"reps\": 10, \"distance_meters\": null, \"duration_seconds\": null, \"custom_metric\": null }\n\n]\n\n}\n\n]\n\n}\n\n}"],
    };
  
    const ai = getAI(firebaseApp);
    const model = getGenerativeModel(ai, {
      model: "gemini-2.5-pro-preview-05-06",
      generationConfig,
      systemInstruction,
    });
    const message: Content = {
      role: "user",
      parts: [
        "INSERT_INPUT_HERE",
      ],
    };
  
    const chat = model.startChat();
  
    const result = await chat.sendMessage(message);
    return result.response.text();
  }

export default defineEventHandler(async (event) => {
  const userInput = getRouterParam(event, "input");

  const result = await generateContent(userInput, app);

  return result;
});
