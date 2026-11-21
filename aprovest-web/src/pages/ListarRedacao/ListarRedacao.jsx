import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../../components/Modal/Modal'
import api, { mensagemDeErro } from '../../services/api'
import { getUsuario } from '../../services/sessao'
import { NOMES_STATUS, formatarData, resumir } from '../../services/formatos'

export default function ListarRedacao() {
  const usuario = getUsuario()
  const [redacoes, setRedacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [excluir, setExcluir] = useState(null)   // redação escolhida para excluir

  async function carregar() {
    try {
      const resposta = await api.get('/redacoes', { params: { usuario: usuario.idUsuario } })
      setRedacoes(resposta.data)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function confirmarExclusao() {
    try {
      await api.delete(`/redacoes/${excluir.idRedacao}`)
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
          <h1 className="titulo-pagina">Minhas redações</h1>
          <p className="subtitulo-pagina mb-0">Escreva, edite e envie suas redações.</p>
        </div>
        <Link to="/aluno/redacoes/nova" className="btn btn-limao"><i className="fa-solid fa-plus me-2"></i>Nova redação</Link>
      </div>

      {erro && <div className="alerta-erro mb-3">{erro}</div>}

      <div className="table-responsive">
        <table className="tabela">
          <thead>
            <tr>
              <th>Título</th>
              <th>Tema</th>
              <th>Situação</th>
              <th>Data</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {redacoes.map((r) => (
              <tr key={r.idRedacao}>
                <td className="fw-bold">{r.titulo}</td>
                <td className="texto-suave">{resumir(r.tema, 70)}</td>
                <td>
                  <span className={`etiqueta ${r.status === 'ENVIADA' ? 'etiqueta-limao' : 'etiqueta-creme'}`}>{NOMES_STATUS[r.status]}</span>
                </td>
                <td>{formatarData(r.dataCriacao)}</td>
                <td className="text-end text-nowrap">
                  <Link to={`/aluno/redacoes/${r.idRedacao}/correcao`} className="btn btn-sm btn-contorno me-1" title="Ver correção">
                    <i className="fa-solid fa-robot"></i>
                  </Link>
                  <Link to={`/aluno/redacoes/${r.idRedacao}/editar`} className="btn btn-sm btn-azul me-1" title="Editar">
                    <i className="fa-solid fa-pen"></i>
                  </Link>
                  <button className="btn btn-sm btn-outline-danger" title="Excluir" onClick={() => setExcluir(r)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {!carregando && redacoes.length === 0 && (
              <tr><td colSpan={5} className="text-center texto-suave">Você ainda não escreveu nenhuma redação.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {excluir && (
        <Modal titulo="Excluir redação" textoConfirmar="Excluir" onConfirmar={confirmarExclusao} onFechar={() => setExcluir(null)}>
          Deseja excluir a redação <strong>{excluir.titulo}</strong>? Essa ação não pode ser desfeita.
        </Modal>
      )}
    </>
  )
}
