import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { mensagemDeErro } from '../../services/api'
import { salvarUsuario } from '../../services/sessao'
import styles from '../Login/Login.module.css'

const VAZIO = { nome: '', email: '', senha: '', confirmacao: '', idVestibularMeta: '', aceite: false }

export default function Cadastro() {
  const [form, setForm] = useState(VAZIO)
  const [vestibulares, setVestibulares] = useState([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await api.get('/vestibulares')
        setVestibulares(resposta.data)
      } catch {
        setVestibulares([])
      }
    }
    carregar()
  }, [])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (form.senha !== form.confirmacao) {
      setErro('As senhas não são iguais.')
      return
    }
    if (!form.aceite) {
      setErro('É preciso aceitar os Termos de Uso e a Política de Privacidade.')
      return
    }
    setCarregando(true)
    try {
      const resposta = await api.post('/auth/cadastro', {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        idVestibularMeta: form.idVestibularMeta ? Number(form.idVestibularMeta) : null,
      })
      salvarUsuario(resposta.data)
      navigate('/aluno')
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className={styles.fundo}>
      <form className={`cartao ${styles.caixa} ${styles.caixaLarga}`} onSubmit={handleSubmit}>
        <span className={styles.icone}><i className="fa-solid fa-user-plus"></i></span>
        <h1 className="h3 mb-1">Criar conta</h1>
        <p className="texto-suave">É grátis e leva menos de um minuto.</p>

        <div className="row g-3">
          <div className="col-12">
            <label className="form-label" htmlFor="nome">Nome completo</label>
            <input id="nome" name="nome" className="form-control" value={form.nome} onChange={handleChange} required maxLength={100} />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required maxLength={100} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="senha">Senha</label>
            <input id="senha" name="senha" type="password" className="form-control" value={form.senha}
              onChange={handleChange} required minLength={6} autoComplete="new-password" />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="confirmacao">Confirmar senha</label>
            <input id="confirmacao" name="confirmacao" type="password" className="form-control" value={form.confirmacao}
              onChange={handleChange} required minLength={6} autoComplete="new-password" />
          </div>
          <div className="col-12">
            <label className="form-label" htmlFor="idVestibularMeta">Qual vestibular você vai prestar?</label>
            <select id="idVestibularMeta" name="idVestibularMeta" className="form-select" value={form.idVestibularMeta} onChange={handleChange}>
              <option value="">Ainda não decidi</option>
              {vestibulares.map((v) => <option key={v.idVestibular} value={v.idVestibular}>{v.sigla} - {v.nome}</option>)}
            </select>
          </div>
          <div className="col-12">
            <div className="form-check">
              <input id="aceite" name="aceite" type="checkbox" className="form-check-input" checked={form.aceite} onChange={handleChange} />
              <label htmlFor="aceite" className="form-check-label">
                Li e aceito os <Link to="/termos">Termos de Uso</Link> e a <Link to="/privacidade">Política de Privacidade</Link>.
              </label>
            </div>
          </div>
        </div>

        {erro && <div className="alerta-erro mt-3">{erro}</div>}

        <button className="btn btn-limao w-100 mt-3" disabled={carregando}>
          {carregando ? 'Criando conta...' : 'Criar conta'}
        </button>
        <p className="text-center mt-3 mb-0">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  )
}
