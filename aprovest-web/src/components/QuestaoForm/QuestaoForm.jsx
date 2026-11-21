import { useEffect, useState } from 'react'
import api from '../../services/api'
import styles from './QuestaoForm.module.css'

const LETRAS = ['A', 'B', 'C', 'D', 'E']

const VAZIO = {
  enunciado: '',
  ano: new Date().getFullYear(),
  fonte: '',
  dificuldade: 'MEDIA',
  idVestibular: '',
  idMateria: '',
  status: 'ATIVO',
  alternativas: LETRAS.map((letra) => ({ letra, texto: '', correta: false })),
}

// Formulário usado nas telas Nova questão e Editar questão
// props: inicial (questão a editar), onSalvar(dados), salvando, erro, textoBotao
export default function QuestaoForm({ inicial, onSalvar, salvando, erro, textoBotao = 'Salvar' }) {
  const [form, setForm] = useState(() => montarFormulario(inicial))
  const [materias, setMaterias] = useState([])
  const [vestibulares, setVestibulares] = useState([])

  useEffect(() => {
    async function carregar() {
      try {
        const [m, v] = await Promise.all([api.get('/materias'), api.get('/vestibulares')])
        setMaterias(m.data)
        setVestibulares(v.data)
      } catch {
        // as listas ficam vazias e a API mostrará o erro ao salvar
      }
    }
    carregar()
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function alterarAlternativa(letra, texto) {
    setForm({ ...form, alternativas: form.alternativas.map((a) => (a.letra === letra ? { ...a, texto } : a)) })
  }

  function marcarCorreta(letra) {
    setForm({ ...form, alternativas: form.alternativas.map((a) => ({ ...a, correta: a.letra === letra })) })
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSalvar({
      enunciado: form.enunciado,
      ano: Number(form.ano),
      fonte: form.fonte,
      dificuldade: form.dificuldade,
      idVestibular: form.idVestibular ? Number(form.idVestibular) : null,
      idMateria: form.idMateria ? Number(form.idMateria) : null,
      status: form.status,
      // só envia as alternativas que foram preenchidas
      alternativas: form.alternativas.filter((a) => a.texto.trim() || a.correta),
    })
  }

  return (
    <form className="cartao" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label" htmlFor="enunciado">Enunciado</label>
          <textarea id="enunciado" name="enunciado" rows={6} className="form-control" value={form.enunciado}
            onChange={handleChange} required maxLength={3000} />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="idVestibular">Vestibular</label>
          <select id="idVestibular" name="idVestibular" className="form-select" value={form.idVestibular} onChange={handleChange} required>
            <option value="">Selecione</option>
            {vestibulares.map((v) => <option key={v.idVestibular} value={v.idVestibular}>{v.sigla}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="idMateria">Matéria</label>
          <select id="idMateria" name="idMateria" className="form-select" value={form.idMateria} onChange={handleChange} required>
            <option value="">Selecione</option>
            {materias.map((m) => <option key={m.idMateria} value={m.idMateria}>{m.nome}</option>)}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label" htmlFor="ano">Ano</label>
          <input id="ano" name="ano" type="number" min={1998} max={2100} className="form-control" value={form.ano} onChange={handleChange} required />
        </div>
        <div className="col-md-2">
          <label className="form-label" htmlFor="dificuldade">Dificuldade</label>
          <select id="dificuldade" name="dificuldade" className="form-select" value={form.dificuldade} onChange={handleChange}>
            <option value="FACIL">Fácil</option>
            <option value="MEDIA">Média</option>
            <option value="DIFICIL">Difícil</option>
          </select>
        </div>
        <div className="col-md-8">
          <label className="form-label" htmlFor="fonte">Fonte</label>
          <input id="fonte" name="fonte" className="form-control" value={form.fonte} onChange={handleChange} maxLength={150}
            placeholder="Ex.: INEP - ENEM 2023, questão 142" />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="status">Situação</label>
          <select id="status" name="status" className="form-select" value={form.status} onChange={handleChange}>
            <option value="ATIVO">Ativa (aparece na banca)</option>
            <option value="INATIVO">Inativa</option>
          </select>
        </div>
      </div>

      <h2 className="h6 mt-4 mb-2">Alternativas <small className="texto-suave fw-normal">(marque a correta)</small></h2>
      {form.alternativas.map((a) => (
        <div key={a.letra} className={`${styles.alternativa} ${a.correta ? styles.correta : ''}`}>
          <label className={styles.marcador} title="Marcar como correta">
            <input type="radio" name="correta" checked={a.correta} onChange={() => marcarCorreta(a.letra)} />
            <span>{a.letra}</span>
          </label>
          <input className="form-control" value={a.texto} onChange={(e) => alterarAlternativa(a.letra, e.target.value)}
            maxLength={500} placeholder={`Texto da alternativa ${a.letra}`} aria-label={`Alternativa ${a.letra}`} />
        </div>
      ))}

      {erro && <div className="alerta-erro mt-3">{erro}</div>}

      <button className="btn btn-limao mt-3" disabled={salvando}>
        <i className="fa-solid fa-floppy-disk me-2"></i>{salvando ? 'Salvando...' : textoBotao}
      </button>
    </form>
  )
}

// Converte a questão vinda da API para o formato do formulário (sempre com as 5 letras)
function montarFormulario(questao) {
  if (!questao) return VAZIO
  return {
    enunciado: questao.enunciado,
    ano: questao.ano,
    fonte: questao.fonte || '',
    dificuldade: questao.dificuldade,
    idVestibular: questao.idVestibular,
    idMateria: questao.idMateria,
    status: questao.status,
    alternativas: LETRAS.map((letra) => {
      const a = questao.alternativas.find((x) => x.letra === letra)
      return { letra, texto: a?.texto || '', correta: !!a?.correta }
    }),
  }
}
