import { useEffect, useState } from 'react'
import Modal from '../../components/Modal/Modal'
import api, { mensagemDeErro } from '../../services/api'
import { NOMES_STATUS, formatarDataHora } from '../../services/formatos'

const CORES = { NOVA: 'etiqueta-limao', LIDA: '', RESPONDIDA: 'etiqueta-sucesso' }

export default function MensagensContato() {
  const [mensagens, setMensagens] = useState([])
  const [aberta, setAberta] = useState(null)
  const [excluir, setExcluir] = useState(null)
  const [erro, setErro] = useState('')

  async function carregar() {
    try {
      const resposta = await api.get('/mensagens')
      setMensagens(resposta.data)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function alterarStatus(m, status) {
    try {
      const resposta = await api.put(`/mensagens/${m.idMensagem}/status`, { status })
      setAberta(resposta.data)
      carregar()
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
  }

  function abrir(m) {
    setAberta(m)
    if (m.status === 'NOVA') alterarStatus(m, 'LIDA')
  }

  async function confirmarExclusao() {
    try {
      await api.delete(`/mensagens/${excluir.idMensagem}`)
      setExcluir(null)
      setAberta(null)
      carregar()
    } catch (erro) {
      setErro(mensagemDeErro(erro))
      setExcluir(null)
    }
  }

  return (
    <>
      <h1 className="titulo-pagina">Mensagens de contato</h1>
      <p className="subtitulo-pagina">Mensagens enviadas pela página Fale Conosco.</p>
      {erro && <div className="alerta-erro mb-3">{erro}</div>}

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="table-responsive">
            <table className="tabela">
              <thead>
                <tr><th>Remetente</th><th>Assunto</th><th>Data</th><th>Situação</th></tr>
              </thead>
              <tbody>
                {mensagens.map((m) => (
                  <tr key={m.idMensagem} onClick={() => abrir(m)} style={{ cursor: 'pointer' }}
                    className={aberta?.idMensagem === m.idMensagem ? 'fw-bold' : ''}>
                    <td>{m.nome}<br /><small className="texto-suave">{m.email}</small></td>
                    <td>{m.assunto}</td>
                    <td className="small">{formatarDataHora(m.dataEnvio)}</td>
                    <td><span className={`etiqueta ${CORES[m.status]}`}>{NOMES_STATUS[m.status]}</span></td>
                  </tr>
                ))}
                {mensagens.length === 0 && <tr><td colSpan={4} className="text-center texto-suave">Nenhuma mensagem recebida.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-5">
          {aberta ? (
            <div className="cartao">
              <span className="etiqueta etiqueta-creme mb-2">{aberta.assunto}</span>
              <h2 className="h5 mb-0">{aberta.nome}</h2>
              <a href={`mailto:${aberta.email}`} className="small">{aberta.email}</a>
              <p className="texto-quebrado mt-3">{aberta.mensagem}</p>
              <div className="d-flex flex-wrap gap-2">
                <a href={`mailto:${aberta.email}?subject=${encodeURIComponent('AproVest - ' + aberta.assunto)}`} className="btn btn-azul btn-sm"
                  onClick={() => alterarStatus(aberta, 'RESPONDIDA')}>
                  <i className="fa-solid fa-reply me-1"></i>Responder por e-mail
                </a>
                <button className="btn btn-sm btn-outline-danger" onClick={() => setExcluir(aberta)}>
                  <i className="fa-solid fa-trash me-1"></i>Excluir
                </button>
              </div>
            </div>
          ) : (
            <div className="cartao texto-suave text-center">Clique em uma mensagem para ler.</div>
          )}
        </div>
      </div>

      {excluir && (
        <Modal titulo="Excluir mensagem" textoConfirmar="Excluir" onConfirmar={confirmarExclusao} onFechar={() => setExcluir(null)}>
          Deseja excluir a mensagem de <strong>{excluir.nome}</strong>?
        </Modal>
      )}
    </>
  )
}
