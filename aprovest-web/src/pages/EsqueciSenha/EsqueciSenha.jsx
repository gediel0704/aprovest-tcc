import { useState } from 'react'
import { Link } from 'react-router-dom'
import api, { mensagemDeErro } from '../../services/api'
import styles from '../Login/Login.module.css'

export default function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    try {
      const resposta = await api.post('/auth/esqueci-senha', { email })
      setMensagem(resposta.data.mensagem)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
  }

  return (
    <div className={styles.fundo}>
      <form className={`cartao ${styles.caixa}`} onSubmit={handleSubmit}>
        <span className={styles.icone}><i className="fa-solid fa-key"></i></span>
        <h1 className="h3 mb-1">Esqueci minha senha</h1>
        <p className="texto-suave">Informe o e-mail da sua conta para receber as instruções.</p>

        <label className="form-label" htmlFor="email">E-mail</label>
        <input id="email" type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />

        {mensagem && <div className="alerta-aviso mt-3"><i className="fa-solid fa-circle-info me-2"></i>{mensagem}</div>}
        {erro && <div className="alerta-erro mt-3">{erro}</div>}

        <button className="btn btn-limao w-100 mt-3">Enviar instruções</button>
        <p className="text-center mt-3 mb-0"><Link to="/login">Voltar para o login</Link></p>
      </form>
    </div>
  )
}
