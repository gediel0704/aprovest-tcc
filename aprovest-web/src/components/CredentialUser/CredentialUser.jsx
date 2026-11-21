import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUsuario, sair } from '../../services/sessao'
import styles from './CredentialUser.module.css'

// Mostra o usuário logado no cabeçalho, com as opções de perfil e sair
export default function CredentialUser() {
  const [aberto, setAberto] = useState(false)
  const navigate = useNavigate()
  const usuario = getUsuario()
  if (!usuario) return null

  const iniciais = usuario.nome.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()

  function handleSair() {
    sair()
    navigate('/login')
  }

  return (
    <div className={styles.credencial}>
      <button className={styles.botao} onClick={() => setAberto(!aberto)}>
        <span className={styles.avatar}>{iniciais}</span>
        <span className={styles.dados}>
          <strong>{usuario.nome.split(' ')[0]}</strong>
          <small>{usuario.tipo === 'ADMIN' ? 'Administrador' : 'Aluno'}</small>
        </span>
        <i className="fa-solid fa-chevron-down"></i>
      </button>
      {aberto && (
        <div className={styles.menu}>
          {usuario.tipo === 'ALUNO' && (
            <Link to="/aluno/perfil" onClick={() => setAberto(false)}>
              <i className="fa-solid fa-user"></i> Meu perfil
            </Link>
          )}
          <button onClick={handleSair}>
            <i className="fa-solid fa-right-from-bracket"></i> Sair
          </button>
        </div>
      )}
    </div>
  )
}
