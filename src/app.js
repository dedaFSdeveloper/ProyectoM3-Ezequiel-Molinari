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
    <button data-path="/home">Volver</button>
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
  if (event.target.dataset.path) {
    navigateTo(event.target.dataset.path)
  }
})

window.addEventListener('popstate', renderRoute)

function renderAbout(){
document.getElementById("app").innerHTML = `
<h1>Chat de Ia Con Diferentes Personajes</h1>
<h2>Chatea con Walter White - Jack Sparrow - Sherlock Holmes</h2>
<p>By Ezequiel Molinari</p>
<button data-path="/home">Volver al inicio</button>
<button data-path="/about">Sobre el proyecto</button>
`
}


renderRoute()
