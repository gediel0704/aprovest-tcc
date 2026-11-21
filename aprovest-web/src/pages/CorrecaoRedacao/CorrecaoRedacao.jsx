import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api, { mensagemDeErro } from '../../services/api'
import { NOMES_STATUS, formatarData } from '../../services/formatos'
import styles from './CorrecaoRedacao.module.css'

// Exemplo de como a correção vai aparecer. A correção automática (IA) ainda está em desenvolvimento.
const COMPETENCIAS = [
  { numero: 1, nome: 'Domínio da norma padrão da língua escrita', nota: 160 },
  { numero: 2, nome: 'Compreensão do tema e do tipo de texto', nota: 160 },
  { numero: 3, nome: 'Seleção e organização das informações', nota: 120 },
  { numero: 4, nome: 'Conhecimento dos mecanismos de coesão', nota: 160 },
  { numero: 5, nome: 'Proposta de intervenção', nota: 120 },
]

export default function CorrecaoRedacao() {
  const { id } = useParams()
  const [redacao, setRedacao] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await api.get(`/redacoes/${id}`)
        setRedacao(resposta.data)
      } catch (erro) {
        setErro(mensagemDeErro(erro))
      }
    }
    carregar()
  }, [id])

  const total = COMPETENCIAS.reduce((soma, c) => soma + c.nota, 0)

  return (
    <>
      <Link to="/aluno/redacoes" className="small"><i className="fa-solid fa-arrow-left me-1"></i>Minhas redações</Link>
      <h1 className="titulo-pagina mt-2">Correção da redação</h1>
      <p className="subtitulo-pagina">Avaliação nas cinco competências do ENEM (0 a 200 pontos cada).</p>

      <div className="alerta-aviso mb-4">
        <i className="fa-solid fa-person-digging me-2"></i>
        A correção automática por inteligência artificial está em desenvolvimento. As notas abaixo são um
        <strong> exemplo</strong> de como o resultado será mostrado.
      </div>

      {erro && <div className="alerta-erro mb-3">{erro}</div>}

      <div className="row g-4">
        <div className="col-lg-7">
          {redacao && (
            <div className="cartao">
              <div className="d-flex flex-wrap gap-2 mb-2">
                <span className="etiqueta etiqueta-limao">{NOMES_STATUS[redacao.status]}</span>
                <span className="etiqueta etiqueta-creme">{formatarData(redacao.dataCriacao)}</span>
              </div>
              <h2 className="h4">{redacao.titulo}</h2>
              <p className="texto-suave small">Tema: {redacao.tema}</p>
              <p className={`texto-quebrado ${styles.texto}`}>{redacao.texto}</p>
            </div>
          )}
        </div>
        <div className="col-lg-5">
          <div className={styles.nota}>
            <span>Nota de exemplo</span>
            <strong>{total}</strong>
            <small>de 1000 pontos</small>
          </div>
          <div className="cartao mt-3">
            {COMPETENCIAS.map((c) => (
              <div key={c.numero} className={styles.competencia}>
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Competência {c.numero}</span>
                  <span className="fw-bold">{c.nota}</span>
                </div>
                <small className="texto-suave">{c.nome}</small>
                <div className={styles.barra}><span style={{ width: `${(c.nota / 200) * 100}%` }}></span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
