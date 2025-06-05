import { ref } from 'vue'

interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

export function useAIChat() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const generateAIResponse = async (
    message: string,
    context: string
  ): Promise<string> => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()
      return data.response
    } catch (err) {
      console.error('Error generating AI response:', err)
      throw err
    }
  }

  return {
    isLoading,
    error,
    generateAIResponse,
  }
}