// Guarda o usuário logado no localStorage do navegador

const CHAVE = 'aprovest_usuario'

export function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE))
  } catch {
    return null
  }
}

export function salvarUsuario(usuario) {
  localStorage.setItem(CHAVE, JSON.stringify(usuario))
}

export function sair() {
  localStorage.removeItem(CHAVE)
}

// Página inicial de cada perfil depois do login
export function paginaInicial(usuario) {
  return usuario?.tipo === 'ADMIN' ? '/admin' : '/aluno'
}
