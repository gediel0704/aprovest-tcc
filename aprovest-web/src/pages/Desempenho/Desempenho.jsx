import { useEffect, useState } from 'react'
import CartaoEstatistica from '../../components/CartaoEstatistica/CartaoEstatistica'
import api, { mensagemDeErro } from '../../services/api'
import { getUsuario } from '../../services/sessao'
import { formatarDataHora } from '../../services/formatos'
import styles from './Desempenho.module.css'

export default function Desempenho() {
  const usuario = getUsuario()
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await api.get(`/usuarios/${usuario.idUsuario}/desempenho`)
        setDados(resposta.data)
      } catch (erro) {
        setErro(mensagemDeErro(erro))
      }
    }
    carregar()
  }, [usuario.idUsuario])

  return (
    <>
      <h1 className="titulo-pagina">Desempenho</h1>
      <p className="subtitulo-pagina">Seus resultados na banca de questões.</p>
      {erro && <div className="alerta-erro mb-3">{erro}</div>}

      {dados && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-4"><CartaoEstatistica icone="fa-list-check" titulo="Respondidas" valor={dados.respondidas} /></div>
            <div className="col-md-4"><CartaoEstatistica icone="fa-check" titulo="Acertos" valor={dados.acertos} cor="limao" /></div>
            <div className="col-md-4"><CartaoEstatistica icone="fa-percent" titulo="Aproveitamento" valor={`${dados.aproveitamento}%`} cor="creme" /></div>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="cartao h-100">
                <h2 className="h5 mb-3">Aproveitamento por matéria</h2>
                {dados.porMateria.length === 0 && <p className="texto-suave">Responda questões para ver seus resultados.</p>}
                {dados.porMateria.map((m) => {
                  const percentual = Math.round((m.acertos / m.respondidas) * 100)
                  return (
                    <div key={m.materia} className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">{m.materia}</span>
                        <span>{m.acertos}/{m.respondidas} · <strong>{percentual}%</strong></span>
                      </div>
                      <div className={styles.barra}>
                        <span className={percentual < 50 ? styles.baixo : ''} style={{ width: `${percentual}%` }}></span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="cartao h-100">
                <h2 className="h5 mb-3">Últimas respostas</h2>
                <div className="table-responsive">
                  <table className="tabela">
                    <thead>
                      <tr><th>Questão</th><th>Matéria</th><th>Resposta</th><th>Data</th></tr>
                    </thead>
                    <tbody>
                      {dados.ultimas.map((u, i) => (
                        <tr key={i}>
                          <td>{u.idQuestao}</td>
                          <td>{u.materia}</td>
                          <td>
                            <span className={`etiqueta ${u.acertou ? 'etiqueta-sucesso' : 'etiqueta-erro'}`}>
                              {u.letraEscolhida} · {u.acertou ? 'certa' : 'errada'}
                            </span>
                          </td>
                          <td className="small">{formatarDataHora(u.dataResposta)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
