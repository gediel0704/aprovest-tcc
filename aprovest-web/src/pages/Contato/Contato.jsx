import { useState } from 'react'
import PaginaInstitucional from '../../components/PaginaInstitucional/PaginaInstitucional'
import api, { mensagemDeErro } from '../../services/api'
import styles from './Contato.module.css'

const ENDERECO = 'Rua Grupo Bandeirantes, 138 - Jardim Belval, Barueri - SP'
const ASSUNTOS = ['Dúvida', 'Sugestão', 'Problema no site', 'Parceria', 'Outro']
const VAZIO = { nome: '', email: '', assunto: 'Dúvida', mensagem: '' }

export default function Contato() {
  const [form, setForm] = useState(VAZIO)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [enviando, setEnviando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setEnviando(true)
    try {
      await api.post('/mensagens', form)
      setSucesso('Mensagem enviada! Vamos responder no seu e-mail.')
      setForm(VAZIO)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <PaginaInstitucional etiqueta="Fale conosco" titulo="Contato"
      subtitulo="Tem uma dúvida, sugestão ou encontrou um problema? Mande uma mensagem para a equipe.">
      <div className="row g-4">
        <div className="col-lg-7">
          <form className="cartao" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="nome">Nome</label>
                <input id="nome" name="nome" className="form-control" value={form.nome} onChange={handleChange} required maxLength={100} />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="email">E-mail</label>
                <input id="email" name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required maxLength={100} />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="assunto">Assunto</label>
                <select id="assunto" name="assunto" className="form-select" value={form.assunto} onChange={handleChange}>
                  {ASSUNTOS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="mensagem">Mensagem</label>
                <textarea id="mensagem" name="mensagem" rows={5} className="form-control" value={form.mensagem}
                  onChange={handleChange} required maxLength={1000} />
                <small className="texto-suave">{form.mensagem.length}/1000</small>
              </div>
            </div>
            {erro && <div className="alerta-erro mt-3">{erro}</div>}
            {sucesso && <div className="alerta-sucesso mt-3">{sucesso}</div>}
            <button className="btn btn-limao mt-3" disabled={enviando}>
              <i className="fa-solid fa-paper-plane me-2"></i>{enviando ? 'Enviando...' : 'Enviar mensagem'}
            </button>
          </form>
        </div>

        <div className="col-lg-5">
          <div className={`cartao mb-3 ${styles.info}`}>
            <i className="fa-solid fa-location-dot"></i>
            <div>
              <strong>Onde o projeto nasceu</strong>
              <span>FIEB - ITB Brasílio Flores de Azevedo</span>
              <span>{ENDERECO}</span>
            </div>
          </div>
          <div className={`cartao mb-3 ${styles.info}`}>
            <i className="fa-solid fa-clock"></i>
            <div>
              <strong>Prazo de resposta</strong>
              <span>Até 2 dias úteis, pelo e-mail informado.</span>
            </div>
          </div>
          <div className={`cartao p-0 ${styles.mapa}`}>
            <iframe title="Localização da FIEB - ITB Brasílio Flores de Azevedo" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(ENDERECO)}&output=embed`}></iframe>
          </div>
        </div>
      </div>
    </PaginaInstitucional>
  )
}
