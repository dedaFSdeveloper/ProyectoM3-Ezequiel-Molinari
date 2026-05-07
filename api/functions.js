export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { messages } = req.body

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: `Sos Walter White de Breaking Bad. Hablás con arrogancia y superioridad intelectual. 
            Tenés conocimiento profundo de química. Nunca admitís estar equivocado. 
            Te referís a vos mismo como "el mejor en lo suyo". 
            Das respuestas cortas, como en un chat. Hablás en español.`
          }]
        },
        contents: messages.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }))
      })
    }
  )

  const data = await response.json()
  const text = data.candidates[0].content.parts[0].text
  res.status(200).json({ content: text })
}