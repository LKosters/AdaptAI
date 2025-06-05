<template>
  <div class="container mx-auto px-4 py-8">
    <BlockHero :link="{ link: '#', title: 'AI Coach', icon: 'line-md:volume-low-filled'}" title="AI Coach" />
    
    <!-- Chat Container -->
    <div class="max-w-4xl mx-auto mt-8 bg-white rounded-lg shadow-lg">
      <!-- Messages Area -->
      <div class="h-[500px] overflow-y-auto p-6 space-y-4" ref="chatContainer">
        <template v-if="aiCoachStore.messages.length === 0">
          <div class="text-center text-gray-500">
            Start chatting with your AI Coach! I can help you with your workouts and routines.
          </div>
        </template>
        <template v-else>
          <div v-for="message in aiCoachStore.messages" :key="message.timestamp" 
               :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']">
            <div :class="[
              'max-w-[70%] rounded-lg p-4',
              message.role === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            ]">
              {{ message.content }}
            </div>
          </div>
        </template>
      </div>

      <!-- Input Area -->
      <div class="border-t p-4">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input
            v-model="userMessage"
            type="text"
            placeholder="Ask your AI coach something..."
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :disabled="isLoading"
          />
          <button
            type="submit"
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            :disabled="isLoading || !userMessage.trim()"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import { useAICoachStore } from '~/stores/aiCoach';
import { useWorkoutsStore } from '~/stores/workouts';
import { useRoutinesStore } from '~/stores/routines';

const aiCoachStore = useAICoachStore();
const workoutsStore = useWorkoutsStore();
const routinesStore = useRoutinesStore();
const userMessage = ref('');
const isLoading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

onMounted(async () => {
  // Fetch initial data
  await Promise.all([
    workoutsStore.fetchRecentWorkouts(),
    routinesStore.fetchRoutines()
  ]);

  // Add initial greeting if chat is empty
  if (aiCoachStore.messages.length === 0) {
    aiCoachStore.addMessage('assistant', 'Hello! I\'m your AI fitness coach. I can help you with your workouts and routines. What would you like to know?');
  }
});

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!userMessage.value.trim() || isLoading.value) return;

  const message = userMessage.value;
  userMessage.value = '';
  isLoading.value = true;

  // Add user message
  aiCoachStore.addMessage('user', message);
  await scrollToBottom();

  try {
    // Here you would typically make an API call to your AI service
    // For now, we'll just echo back a simple response
    const context = `${aiCoachStore.getWorkoutContext}\n${aiCoachStore.getRoutineContext}`;
    
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    aiCoachStore.addMessage('assistant', `I see your fitness data. How can I help you with your training?`);
    await scrollToBottom();
  } catch (error) {
    console.error('Error processing message:', error);
    aiCoachStore.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
  } finally {
    isLoading.value = false;
  }
};
</script>
