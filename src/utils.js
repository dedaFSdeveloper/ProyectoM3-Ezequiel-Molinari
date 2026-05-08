export function formatMessage(role, content) {
  return { role, content }
}

export function isEmptyMessage(text) {
  return !text || text.trim() === ''
}

export function parseAIResponse(data) {
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

export function limitMessages(messages, max = 20) {
  return messages.slice(-max)
}