import { H3Event } from 'h3'
import type {
  ChatSession,
  GenerationConfig,
  Content,
} from "firebase/ai";
import { getGenerativeModel, getAI } from "firebase/ai";
import type { FirebaseApp } from "firebase/app";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { message, context } = await readBody(event)
    const nuxtApp = useNuxtApp();

    const generationConfig: GenerationConfig = {
      responseMimeType: "text/plain",
    };

    const systemInstruction: Content = {
      role: "system",
      parts: [
        {
          text: `You are an AI fitness coach. Use the following context about the user's workouts and routines to provide personalized advice:

${context}

Keep responses concise, friendly, and focused on helping the user achieve their fitness goals. Provide specific, actionable advice based on their workout history and available routines.`
        },
      ],
    };

    const ai = getAI(nuxtApp.$firebaseApp as FirebaseApp);
    const model = getGenerativeModel(ai, {
      model: "gemini-2.5-flash-preview-05-20",
      generationConfig,
      systemInstruction,
    });

    const chat = model.startChat();
    const userMessage: Content = {
      role: "user",
      parts: [{ text: message }],
    };

    const response = await chat.sendMessage(userMessage.parts);
    const responseText = response.response.text();

    return {
      response: responseText
    }
  } catch (error) {
    console.error('Error in AI chat endpoint:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to generate AI response'
    })
  }
})