import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../Logo/Logo'
import { getUsuario, paginaInicial } from '../../services/sessao'
import styles from './MenuPublico.module.css'

const LINKS = [
  { para: '/', texto: 'Início' },
  { para: '/sobre', texto: 'Sobre' },
  { para: '/servicos', texto: 'Serviços' },
  { para: '/ajuda', texto: 'Ajuda' },
  { para: '/contato', texto: 'Contato' },
]

export default function MenuPublico() {
  const [aberto, setAberto] = useState(false)
  const usuario = getUsuario()

  return (
    <header className={styles.menu}>
      <div className={`container ${styles.conteudo}`}>
        <Logo claro />

        <button className={styles.botaoMenu} onClick={() => setAberto(!aberto)} aria-label="Abrir menu">
          <i className={`fa-solid ${aberto ? 'fa-xmark' : 'fa-bars'}`}></i>
        </button>

        <nav className={`${styles.links} ${aberto ? styles.aberto : ''}`}>
          {LINKS.map((l) => (
            <NavLink key={l.para} to={l.para} end onClick={() => setAberto(false)}
              className={({ isActive }) => (isActive ? styles.ativo : '')}>
              {l.texto}
            </NavLink>
          ))}
          <div className={styles.acoes}>
            {usuario ? (
              <Link to={paginaInicial(usuario)} className="btn btn-limao">
                <i className="fa-solid fa-gauge me-2"></i>Meu painel
              </Link>
            ) : (
              <>
                <Link to="/login" className={`btn ${styles.entrar}`}>Entrar</Link>
                <Link to="/cadastro" className="btn btn-limao">Criar conta</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
