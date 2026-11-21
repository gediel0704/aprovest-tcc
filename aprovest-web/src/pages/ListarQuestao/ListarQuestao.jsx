import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../../components/Modal/Modal'
import api, { mensagemDeErro } from '../../services/api'
import { NOMES_STATUS, resumir } from '../../services/formatos'

// UC Manter Questão - Consultar (com filtros) e Excluir
export default function ListarQuestao() {
  const [questoes, setQuestoes] = useState([])
  const [materias, setMaterias] = useState([])
  const [vestibulares, setVestibulares] = useState([])
  const [filtro, setFiltro] = useState({ busca: '', materia: '', vestibular: '' })
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [excluir, setExcluir] = useState(null)

  async function carregar(f = filtro) {
    try {
      const resposta = await api.get('/questoes', {
        params: { busca: f.busca || undefined, materia: f.materia || undefined, vestibular: f.vestibular || undefined },
      })
      setQuestoes(resposta.data)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
  }

  useEffect(() => {
    async function iniciar() {
      try {
        const [m, v] = await Promise.all([api.get('/materias'), api.get('/vestibulares')])
        setMaterias(m.data)
        setVestibulares(v.data)
      } catch (erro) {
        setErro(mensagemDeErro(erro))
      }
    }
    iniciar()
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleChange(e) {
    setFiltro({ ...filtro, [e.target.name]: e.target.value })
  }

  function pesquisar(e) {
    e.preventDefault()
    carregar()
  }

  function limpar() {
    const vazio = { busca: '', materia: '', vestibular: '' }
    setFiltro(vazio)
    carregar(vazio)
  }

  async function confirmarExclusao() {
    try {
      await api.delete(`/questoes/${excluir.idQuestao}`)
      setMensagem(`Questão ${excluir.idQuestao} excluída com sucesso.`)
      setExcluir(null)
      carregar()
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setExcluir(null)
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="titulo-pagina">Questões</h1>
          <p className="subtitulo-pagina mb-0">Cadastre, consulte, altere e exclua as questões do banco.</p>
        </div>
        <Link to="/admin/questoes/nova" className="btn btn-limao"><i className="fa-solid fa-plus me-2"></i>Nova questão</Link>
      </div>

      <form className="cartao mb-3" onSubmit={pesquisar}>
        <div className="row g-2 align-items-end">
          <div className="col-md-5">
            <label className="form-label small" htmlFor="busca">Pesquisar no enunciado</label>
            <input id="busca" name="busca" className="form-control" value={filtro.busca} onChange={handleChange} placeholder="Ex.: energia, Brasil..." />
          </div>
          <div className="col-md-3">
            <label className="form-label small" htmlFor="materia">Matéria</label>
            <select id="materia" name="materia" className="form-select" value={filtro.materia} onChange={handleChange}>
              <option value="">Todas</option>
              {materias.map((m) => <option key={m.idMateria} value={m.idMateria}>{m.nome}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label small" htmlFor="vestibular">Vestibular</label>
            <select id="vestibular" name="vestibular" className="form-select" value={filtro.vestibular} onChange={handleChange}>
              <option value="">Todos</option>
              {vestibulares.map((v) => <option key={v.idVestibular} value={v.idVestibular}>{v.sigla}</option>)}
            </select>
          </div>
          <div className="col-md-2 d-flex gap-1">
            <button className="btn btn-azul flex-fill" title="Pesquisar"><i className="fa-solid fa-magnifying-glass"></i></button>
            <button type="button" className="btn btn-contorno flex-fill" onClick={limpar} title="Limpar filtros"><i className="fa-solid fa-eraser"></i></button>
          </div>
        </div>
      </form>

      {mensagem && <div className="alerta-sucesso mb-3">{mensagem}</div>}
      {erro && <div className="alerta-erro mb-3">{erro}</div>}

      <p className="texto-suave small mb-2">{questoes.length} questão(ões) encontrada(s)</p>
      <div className="table-responsive">
        <table className="tabela">
          <thead>
            <tr>
              <th>Código</th>
              <th>Enunciado</th>
              <th>Matéria</th>
              <th>Vestibular</th>
              <th>Situação</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {questoes.map((q) => (
              <tr key={q.idQuestao}>
                <td className="fw-bold">{q.idQuestao}</td>
                <td>{resumir(q.enunciado, 90)}</td>
                <td>{q.materia?.nome}</td>
                <td>{q.vestibular?.sigla} {q.ano}</td>
                <td>
                  <span className={`etiqueta ${q.status === 'ATIVO' ? 'etiqueta-sucesso' : 'etiqueta-creme'}`}>{NOMES_STATUS[q.status]}</span>
                </td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/questoes/${q.idQuestao}/editar`} className="btn btn-sm btn-azul me-1" title="Alterar">
                    <i className="fa-solid fa-pen"></i>
                  </Link>
                  <button className="btn btn-sm btn-outline-danger" title="Excluir" onClick={() => setExcluir(q)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {questoes.length === 0 && (
              <tr><td colSpan={6} className="text-center texto-suave">Nenhuma questão encontrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {excluir && (
        <Modal titulo="Excluir questão" textoConfirmar="Excluir" onConfirmar={confirmarExclusao} onFechar={() => setExcluir(null)}>
          Deseja excluir a questão <strong>{excluir.idQuestao}</strong>? As alternativas e as respostas dos alunos
          para essa questão também serão excluídas.
        </Modal>
      )}
    </>
  )
}
