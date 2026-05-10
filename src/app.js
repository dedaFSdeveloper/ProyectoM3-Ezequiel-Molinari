const personaje = 'Walter White'
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
      <h1>IA Chat</h1>
      <p>Chateá con tus personajes favoritos usando inteligencia artificial</p>
      <div class="character-card">
        <h2>Walter White</h2>
        <p>Breaking Bad • Químico • El mejor en lo suyo</p>
      </div>
      <button class="btn-primary" data-path="/chat">Empezar a chatear</button>
    </div>
  `
}

function renderChat() {
  document.getElementById('app').innerHTML = `
    <div class="chat-container">
      <div class="chat-header">
        <h2>Chat con ${personaje}</h2>
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
})

window.addEventListener('popstate', renderRoute)
renderRoute()