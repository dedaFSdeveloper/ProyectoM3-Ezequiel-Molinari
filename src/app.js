const personajes = [
  {
    id: 'walter',
    nombre: 'Walter White',
    serie: 'Breaking Bad',
    descripcion: 'Químico · El mejor en lo suyo',
    prompt: `Sos Walter White de Breaking Bad. Hablás con arrogancia y superioridad intelectual. Tenés conocimiento profundo de química. Nunca admitís estar equivocado. Te referís a vos mismo como el mejor en lo suyo. Das respuestas cortas como en un chat. Hablás en español.`
  },
  {
    id: 'sherlock',
    nombre: 'Sherlock Holmes',
    serie: 'Sherlock BBC',
    descripcion: 'Detective · Mente brillante · Condescendiente',
    prompt: `Sos Sherlock Holmes. Hablás de forma señorial y condescendiente. Deducís cosas del interlocutor constantemente. Considerás a casi todos inferiores intelectualmente. Das respuestas cortas y directas. Hablás en español.`
  },
  {
    id: 'sparrow',
    nombre: 'Jack Sparrow',
    serie: 'Piratas del Caribe',
    descripcion: 'Pirata · Impredecible · Gracioso',
    prompt: `Sos Jack Sparrow de Piratas del Caribe. Hablás de forma errática e impredecible. Sos gracioso y sarcástico. Hacés referencias al ron y al mar. A veces terminás frases con "savvy?". Das respuestas cortas y divertidas. Hablás en español.`
  }
]

let personajeActual = personajes[0]
const mensaje = []

function navbar() {
  return `
    <nav>
      <span class="logo">IA Chat</span>
      <div class="nav-links">
        <button data-path="/home">Inicio</button>
        <button data-path="/chat">Chat</button>
        <button data-path="/about">About</button>
      </div>
    </nav>
  `
}

function renderHome() {
  document.getElementById('app').innerHTML = `
    ${navbar()}
    <div class="home-container">
      <h1>AI Chat</h1>
      <p>Elegí un personaje y empezá a chatear</p>
      ${personajes.map(p => `
        <div class="character-card" data-id="${p.id}">
          <h2>${p.nombre}</h2>
          <p>${p.serie} · ${p.descripcion}</p>
        </div>
      `).join('')}
    </div>
  `
}

function renderChat() {
  document.getElementById('app').innerHTML = `
    <div class="chat-container">
      <div class="chat-header">
        <h2>${personajeActual.nombre}</h2>
        <button data-path="/home">Volver</button>
      </div>
      <div class="chat-messages" id="messages"></div>
      <div class="chat-input">
        <input type="text" id="user-input" placeholder="Escribí tu mensaje..." />
        <button id="send-btn">Enviar</button>
      </div>
    </div>
  `
  renderMensaje()
  document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage()
  })
}

function renderMensaje() {
  const container = document.getElementById('messages')
  container.innerHTML = mensaje.map(msg => `
    <div class="message ${msg.role} ${msg.content === '...' ? 'typing' : ''}">
      <p>${msg.content}</p>
    </div>
  `).join('')
  container.scrollTop = container.scrollHeight
}

async function sendMessage() {
  const input = document.getElementById('user-input')
  const text = input.value.trim()
  if (!text) return

  mensaje.push({ role: 'user', content: text })
  input.value = ''
  renderMensaje()

  mensaje.push({ role: 'assistant', content: '...' })
  renderMensaje()

  try {
    const mensajesLimpios = mensaje.filter(m => m.content !== '...')

    const response = await fetch('/api/functions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: mensajesLimpios })
    })

    const data = await response.json()
    mensaje[mensaje.length - 1].content = data.content
    renderMensaje()

  } catch (error) {
    mensaje[mensaje.length - 1].content = 'Error al conectar con la IA.'
    renderMensaje()
  }
}

function renderAbout() {
  document.getElementById('app').innerHTML = `
    ${navbar()}
    <div class="about-container">
      <h1>Sobre el proyecto</h1>
      <p>ComicSansCon Chat es una aplicación donde podés chatear con personajes ficticios usando inteligencia artificial.</p>
      <p>Los personajes disponibles son Walter White, Jack Sparrow y Sherlock Holmes.</p>
      <p>Hecho por Ezequiel Molinari</p>
    </div>
  `
}

function navigateTo(path) {
  window.history.pushState({}, '', path)
  renderRoute()
}

function renderRoute() {
  const path = window.location.pathname
  if (path === '/chat') {
    renderChat()
  } else if (path === '/about') {
    renderAbout()
  } else {
    renderHome()
  }
}

document.getElementById('app').addEventListener('click', (event) => {
  if (event.target.dataset.path) navigateTo(event.target.dataset.path)
  if (event.target.id === 'send-btn') sendMessage()
  
  const card = event.target.closest('[data-id]')
  if (card) {
    const seleccionado = personajes.find(p => p.id === card.dataset.id)
    if (seleccionado) {
      personajeActual = seleccionado
      mensaje.length = 0
      navigateTo('/chat')
    }
  }
})
window.addEventListener('popstate', renderRoute)
renderRoute()