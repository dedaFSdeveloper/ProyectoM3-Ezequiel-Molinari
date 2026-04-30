const personaje = 'Walter White'

function renderHome() {
  document.getElementById('app').innerHTML = `
    <h1>Bienvenido</h1>
    <p>Chateá con ${personaje}</p>
    <button data-path="/chat">Ir al chat</button>
  `
}

function renderChat() {
  document.getElementById('app').innerHTML = `
    <h1>Chat con ${personaje}</h1>
    <button data-path="navigateTo('/home')">Volver</button>
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
  } else {
    renderHome()
  }
}

document.getElementById('app').addEventListener('click', (event) => {
  if (event.target.dataset.path) {
    navigateTo(event.target.dataset.path)
  }
})

renderRoute()