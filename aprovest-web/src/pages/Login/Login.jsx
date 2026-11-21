import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { mensagemDeErro } from '../../services/api'
import { paginaInicial, salvarUsuario } from '../../services/sessao'
import styles from './Login.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const resposta = await api.post('/auth/login', { email, senha })
      salvarUsuario(resposta.data)
      navigate(paginaInicial(resposta.data))
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className={styles.fundo}>
      <form className={`cartao ${styles.caixa}`} onSubmit={handleSubmit}>
        <span className={styles.icone}><i className="fa-solid fa-right-to-bracket"></i></span>
        <h1 className="h3 mb-1">Entrar</h1>
        <p className="texto-suave">Acesse sua conta para continuar estudando.</p>

        <label className="form-label" htmlFor="email">E-mail</label>
        <input id="email" type="email" className="form-control mb-3" value={email}
          onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />

        <label className="form-label" htmlFor="senha">Senha</label>
        <input id="senha" type="password" className="form-control" value={senha}
          onChange={(e) => setSenha(e.target.value)} required autoComplete="current-password" />

        <div className="text-end mt-2">
          <Link to="/esqueci-senha" className="small">Esqueci minha senha</Link>
        </div>

        {erro && <div className="alerta-erro mt-3">{erro}</div>}

        <button className="btn btn-limao w-100 mt-3" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-center mt-3 mb-0">
          Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
        </p>
      </form>
    </div>
  )
}
