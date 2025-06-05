import { OpenAI } from 'openai'
import { H3Event } from 'h3'

const config = useRuntimeConfig()

const openai = new OpenAI({
  apiKey: config.openaiApiKey
})

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { message, context } = await readBody(event)

    const systemPrompt = `You are an AI fitness coach. Use the following context about the user's workouts and routines to provide personalized advice:

${context}

Keep responses concise, friendly, and focused on helping the user achieve their fitness goals.`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    return {
      response: completion.choices[0].message.content
    }
  } catch (error) {
    console.error('Error in AI chat endpoint:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to generate AI response'
    })
  }
})