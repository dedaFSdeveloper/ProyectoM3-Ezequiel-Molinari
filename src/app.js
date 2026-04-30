const personaje = 'Walter White'
const mensaje = []

function renderHome() {
  document.getElementById('app').innerHTML = `
    <h1>Bienvenido</h1>
    <p>Chateá con ${personaje}</p>
    <button data-path="/chat">Ir al chat</button>
    <button data-path="/about">Sobre el proyecto</button>
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
}

function renderMensaje() {
  const container = document.getElementById('messages')
  container.innerHTML = mensaje.map(msg => `
    <div class="mensaje ${msg.role}">
      <p>${msg.content}</p>
    </div>
  `).join('')
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

function renderAbout() {
  document.getElementById('app').innerHTML = `
    <h1>Chat de IA Con Diferentes Personajes</h1>
    <h2>Chateá con Walter White - Jack Sparrow - Sherlock Holmes</h2>
    <p>By Ezequiel Molinari</p>
    <button data-path="/home">Volver al inicio</button>
  `
}

document.getElementById('app').addEventListener('click', (event) => {
  if (event.target.dataset.path) {
    navigateTo(event.target.dataset.path)
  }
})

window.addEventListener('popstate', renderRoute)

// TEST TEMPORAL - lo borramos después
mensaje.push({ role: 'user', content: 'Hola Walter' })
mensaje.push({ role: 'assistant', content: 'De qué querés hablar' })

renderRoute()