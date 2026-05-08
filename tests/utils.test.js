import { describe, it, expect } from 'vitest'
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