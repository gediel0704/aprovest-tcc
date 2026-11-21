import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Logo from '../Logo/Logo'
import CredentialUser from '../CredentialUser/CredentialUser'
import styles from './LayoutPainel.module.css'

const MENU_ALUNO = [
  { titulo: 'Estudo' },
  { para: '/aluno', icone: 'fa-gauge', texto: 'Painel' },
  { para: '/aluno/banca', icone: 'fa-bolt', texto: 'Banca de questões' },
  { para: '/aluno/simulados', icone: 'fa-stopwatch', texto: 'Simulados' },
  { titulo: 'Redação' },
  { para: '/aluno/redacoes', icone: 'fa-pen-nib', texto: 'Minhas redações' },
  { titulo: 'Acompanhamento' },
  { para: '/aluno/desempenho', icone: 'fa-chart-line', texto: 'Desempenho' },
  { para: '/aluno/perfil', icone: 'fa-user', texto: 'Meu perfil' },
]

const MENU_ADMIN = [
  { titulo: 'Administração' },
  { para: '/admin', icone: 'fa-gauge', texto: 'Painel' },
  { para: '/admin/questoes', icone: 'fa-list-check', texto: 'Questões' },
  { para: '/admin/usuarios', icone: 'fa-users', texto: 'Usuários' },
  { para: '/admin/mensagens', icone: 'fa-envelope', texto: 'Mensagens de contato' },
]

// Estrutura das páginas de quem está logado: menu lateral + cabeçalho + conteúdo
export default function LayoutPainel({ perfil }) {
  const [menuAberto, setMenuAberto] = useState(false)
  const itens = perfil === 'ADMIN' ? MENU_ADMIN : MENU_ALUNO

  return (
    <div className={styles.painel}>
      <aside className={`${styles.lateral} ${menuAberto ? styles.aberto : ''}`}>
        <div className={styles.logo}>
          <Logo claro link={perfil === 'ADMIN' ? '/admin' : '/aluno'} />
        </div>
        <nav>
          {itens.map((item) =>
            item.titulo ? (
              <span key={item.titulo} className={styles.secao}>{item.titulo}</span>
            ) : (
              <NavLink key={item.para} to={item.para} end onClick={() => setMenuAberto(false)}
                className={({ isActive }) => `${styles.item} ${isActive ? styles.ativo : ''}`}>
                <i className={`fa-solid ${item.icone}`}></i>
                {item.texto}
              </NavLink>
            ),
          )}
        </nav>
        <NavLink to="/" className={styles.voltarSite}>
          <i className="fa-solid fa-arrow-left"></i> Voltar ao site
        </NavLink>
      </aside>

      <div className={styles.principal}>
        <header className={styles.topo}>
          <button className={styles.botaoMenu} onClick={() => setMenuAberto(!menuAberto)} aria-label="Abrir menu">
            <i className="fa-solid fa-bars"></i>
          </button>
          <span className={styles.perfil}>
            {perfil === 'ADMIN' ? 'Área do administrador' : 'Área do aluno'}
          </span>
          <CredentialUser />
        </header>
        <main className={styles.conteudo}>
          <Outlet />
        </main>
      </div>
      {menuAberto && <div className={styles.fundo} onClick={() => setMenuAberto(false)}></div>}
    </div>
  )
}
