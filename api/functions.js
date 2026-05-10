export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages, prompt } = req.body

    console.log('KEY existe:', !!process.env.GEMINI_API_KEY)

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: prompt }]
          },
          contents: messages.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          }))
        })
      }
    )
console.log('KEY:', process.env.GEMINI_API_KEY)
    const data = await response.json()
    console.log('Respuesta Gemini:', JSON.stringify(data))

    if (data.error) {
      return res.status(500).json({ error: data.error.message })
    }

    const text = data.candidates[0].content.parts[0].text
    res.status(200).json({ content: text })

  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({ error: error.message })
  }
}