import { describe, it, expect, vi } from 'vitest'
import { formatMessage, isEmptyMessage, parseAIResponse, limitMessages } from '../src/utils.js'

describe('formatMessage', () => {
  it('debe retornar un objeto con role y content', () => {
    const result = formatMessage('user', 'Hola')
    expect(result).toEqual({ role: 'user', content: 'Hola' })
  })
})

describe('isEmptyMessage', () => {
  it('debe retornar true si el mensaje está vacío', () => {
    expect(isEmptyMessage('')).toBe(true)
  })

  it('debe retornar false si el mensaje tiene texto', () => {
    expect(isEmptyMessage('Hola Walter')).toBe(false)
  })
})

describe('parseAIResponse', () => {
  it('debe extraer el texto de la respuesta de Gemini', () => {
    const fakeResponse = {
      candidates: [{ content: { parts: [{ text: 'Soy Walter White' }] } }]
    }
    expect(parseAIResponse(fakeResponse)).toBe('Soy Walter White')
  })

  it('debe retornar string vacío si la respuesta es inválida', () => {
    expect(parseAIResponse({})).toBe('')
  })
})

describe('limitMessages', () => {
  it('debe limitar el historial a 20 mensajes', () => {
    const msgs = Array.from({ length: 25 }, (_, i) => ({ role: 'user', content: `msg ${i}` }))
    expect(limitMessages(msgs).length).toBe(20)
  })
})

describe('fetch mock', () => {
  it('simula llamada a la API y devuelve respuesta correcta', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({ content: 'Soy Walter White' })
    })

    const response = await fetchMock('/api/functions', {
      method: 'POST',
      body: JSON.stringify({ messages: [], prompt: 'test' })
    })
    const data = await response.json()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith('/api/functions', expect.objectContaining({ method: 'POST' }))
    expect(data.content).toBe('Soy Walter White')
  })

  it('simula error de la API correctamente', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Network error'))

    await expect(fetchMock('/api/functions')).rejects.toThrow('Network error')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})