import { Navigate } from 'react-router-dom'
import { getUsuario, paginaInicial } from '../../services/sessao'

// Só deixa entrar quem está logado e tem o perfil certo (ALUNO ou ADMIN)
export default function RotaProtegida({ perfil, children }) {
  const usuario = getUsuario()
  if (!usuario) return <Navigate to="/login" replace />
  if (perfil && usuario.tipo !== perfil) return <Navigate to={paginaInicial(usuario)} replace />
  return children
}
