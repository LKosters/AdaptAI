<template>
  <div>
    <BlockHero :link="{ link: '#', title: 'AI Coach', icon: 'line-md:volume-low-filled'}" title="AI Coach" />
    
    <!-- Chat Container -->
    <div class="bg-[#282828]/70 rounded-[20px] overflow-hidden">
      <!-- Messages Area -->
      <div class="h-[calc(100vh-300px)] min-h-[400px] overflow-y-auto p-4 space-y-3" ref="chatContainer">
        <template v-if="aiCoachStore.messages.length === 0">
          <div class="text-center text-gray-400 mt-8">
            <Icon name="line-md:ai" class="!size-12 mb-2 mx-auto" />
            <p>Start chatting with your AI Coach! I can help you with your workouts and routines.</p>
          </div>
        </template>
        <template v-else>
          <div v-for="message in aiCoachStore.messages" :key="message.timestamp" 
               :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']">
            <div :class="[
              'max-w-[85%] rounded-[20px] p-4',
              message.role === 'user' 
                ? 'bg-primary text-black font-medium' 
                : 'bg-[#1E1E1E] text-white'
            ]">
              <div class="flex items-start gap-2">
                <Icon 
                  v-if="message.role === 'assistant'"
                  name="line-md:ai" 
                  class="!size-5 mt-1 flex-shrink-0" 
                />
                <div class="break-words">{{ message.content }}</div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Input Area -->
      <div class="border-t border-[#3E3E3E] p-4">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input
            v-model="userMessage"
            type="text"
            placeholder="Ask your AI coach something..."
            class="flex-1 px-4 py-3 bg-[#1E1E1E] border border-[#3E3E3E] text-white rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary/50"
            :disabled="isLoading"
          />
          <button
            type="submit"
            class="btn-primary !w-auto px-6"
            :disabled="isLoading || !userMessage.trim()"
          >
            <Icon v-if="isLoading" name="line-md:loading-twotone-loop" class="!size-6" />
            <Icon v-else name="line-md:send-filled" class="!size-6" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue'
import type { Ref } from 'vue'
import { useNuxtApp } from '#app'
import { useAICoachStore } from '~/stores/aiCoach'
import { useWorkoutsStore } from '~/stores/workouts'
import { useRoutinesStore } from '~/stores/routines'
import type { FirebaseApp } from 'firebase/app'
import type {
  ChatSession,
  GenerationConfig,
  Content,
  GenerativeModel,
  Part
} from 'firebase/ai'
import { getGenerativeModel, getAI } from 'firebase/ai'
import type { AIMessage, Workout, Routine } from '~/types'

const nuxtApp = useNuxtApp()
const aiCoachStore = useAICoachStore()
const workoutsStore = useWorkoutsStore()
const routinesStore = useRoutinesStore()

const userMessage: Ref<string> = ref('')
const isLoading: Ref<boolean> = ref(false)
const chatContainer: Ref<HTMLElement | null> = ref(null)
const chat: Ref<ChatSession | null> = ref(null)

onMounted(async () => {
  // Fetch initial data
  await Promise.all([
    workoutsStore.fetchRecentWorkouts(),
    routinesStore.fetchRoutines()
  ])

  // Initialize Gemini chat
  const generationConfig: GenerationConfig = {
    responseMimeType: "text/plain",
  }

  const context = `
Recent Workouts:
${workoutsStore.recentWorkouts?.workouts.map((w: Workout) => `- ${w.title} (${w.start_time})`).join('\n') || 'No recent workouts'}

Available Routines:
${routinesStore.routines?.routines.map((r: Routine) => `- ${r.title} (${r.exercises.length} exercises)`).join('\n') || 'No routines'}
`

  const systemInstruction: Content = {
    role: "system",
    parts: [
      {
        text: `You are an AI fitness coach. Use the following context about the user's workouts and routines to provide personalized advice:

${context}

Keep responses concise, friendly, and focused on helping the user achieve their fitness goals. Provide specific, actionable advice based on their workout history and available routines.`
      } as Part,
    ],
  }

  const ai = getAI(nuxtApp.$firebaseApp as FirebaseApp)
  const model: GenerativeModel = getGenerativeModel(ai, {
    model: "gemini-2.5-flash-preview-05-20",
    generationConfig,
    systemInstruction,
  })

  chat.value = model.startChat()

  // Add initial greeting if chat is empty
  if (aiCoachStore.messages.length === 0) {
    aiCoachStore.addMessage('assistant', 'Hello! I\'m your AI fitness coach. I can help you with your workouts and routines. What would you like to know?')
  }

  // Initial scroll to bottom
  await scrollToBottom()
})

const scrollToBottom = async (): Promise<void> => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async (): Promise<void> => {
  if (!userMessage.value.trim() || isLoading.value || !chat.value) return

  const message = userMessage.value
  userMessage.value = ''
  isLoading.value = true

  // Add user message
  aiCoachStore.addMessage('user', message)
  await scrollToBottom()

  try {
    const userMessage: Content = {
      role: "user",
      parts: [{ text: message } as Part],
    }

    const response = await chat.value.sendMessage(userMessage.parts)
    const responseText = response.response.text()
    
    // Add AI response to chat
    aiCoachStore.addMessage('assistant', responseText)
    await scrollToBottom()
  } catch (error) {
    console.error('Error processing message:', error)
    aiCoachStore.addMessage('assistant', 'Sorry, I encountered an error. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.overflow-y-auto {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
