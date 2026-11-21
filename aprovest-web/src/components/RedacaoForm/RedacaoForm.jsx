import { useState } from 'react'

// Temas oficiais das últimas provas, para facilitar a escolha
const TEMAS = [
  'Desafios para o enfrentamento da invisibilidade do trabalho de cuidado realizado pela mulher no Brasil',
  'Desafios para a valorização de comunidades e povos tradicionais no Brasil',
  'Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil',
  'Estigma associado às doenças mentais na sociedade brasileira',
]

// Formulário usado nas telas Nova redação e Editar redação
// props: inicial (dados da redação), onSalvar(dados), salvando, erro
export default function RedacaoForm({ inicial, onSalvar, salvando, erro }) {
  const [form, setForm] = useState({ titulo: '', tema: '', texto: '', ...inicial })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function salvar(status) {
    onSalvar({ titulo: form.titulo, tema: form.tema, texto: form.texto, status })
  }

  const linhas = form.texto ? form.texto.split('\n').filter((l) => l.trim()).length : 0

  return (
    <form className="cartao" onSubmit={(e) => { e.preventDefault(); salvar('ENVIADA') }}>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label" htmlFor="titulo">Título</label>
          <input id="titulo" name="titulo" className="form-control" value={form.titulo} onChange={handleChange} required maxLength={150} />
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="tema">Tema</label>
          <input id="tema" name="tema" className="form-control" list="temas" value={form.tema} onChange={handleChange}
            required maxLength={200} placeholder="Escolha um tema da lista ou digite outro" />
          <datalist id="temas">
            {TEMAS.map((t) => <option key={t} value={t} />)}
          </datalist>
        </div>
        <div className="col-12">
          <label className="form-label" htmlFor="texto">Texto</label>
          <textarea id="texto" name="texto" className="form-control" rows={14} value={form.texto} onChange={handleChange}
            required maxLength={5000} style={{ lineHeight: 1.7 }} />
          <small className="texto-suave">{form.texto.length}/5000 caracteres · {linhas} parágrafo(s)</small>
        </div>
      </div>

      {erro && <div className="alerta-erro mt-3">{erro}</div>}

      <div className="d-flex flex-wrap gap-2 mt-3">
        <button type="button" className="btn btn-contorno" disabled={salvando} onClick={() => salvar('RASCUNHO')}>
          <i className="fa-solid fa-floppy-disk me-2"></i>Salvar rascunho
        </button>
        <button type="submit" className="btn btn-limao" disabled={salvando}>
          <i className="fa-solid fa-paper-plane me-2"></i>Enviar redação
        </button>
      </div>
    </form>
  )
}
