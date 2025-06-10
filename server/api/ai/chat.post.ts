import type { H3Event } from "h3";
import { defineEventHandler, readBody, createError } from "h3";
import type { ChatSession, GenerationConfig, Content, Part } from "firebase/ai";
import { getGenerativeModel, getAI } from "firebase/ai";
import type { FirebaseApp } from "firebase/app";
import { useNuxtApp } from "#app";

interface ChatRequest {
  message: string;
  context: string;
}

interface ChatResponse {
  response: string;
}

export default defineEventHandler(
  async (event: H3Event): Promise<ChatResponse> => {
    try {
      const { message, context } = await readBody<ChatRequest>(event);

      const generationConfig: GenerationConfig = {
        responseMimeType: "text/plain",
      };

      const systemInstruction: Content = {
        role: "system",
        parts: [
          {
            text: `You are an AI fitness coach. Use the following context about the user's workouts and routines to provide personalized advice:

${context}

Keep responses concise, friendly, and focused on helping the user achieve their fitness goals. Provide specific, actionable advice based on their workout history and available routines.`,
          } as Part,
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
        parts: [{ text: message } as Part],
      };

      const response = await chat.sendMessage(userMessage.parts);
      const responseText = response.response.text();

      return {
        response: responseText,
      };
    } catch (error) {
      console.error("Error in AI chat endpoint:", error);
      throw createError({
        statusCode: 500,
        message: "Failed to generate AI response",
      });
    }
  },
);
