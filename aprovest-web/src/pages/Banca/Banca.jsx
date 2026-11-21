import { useEffect, useState } from 'react'
import api, { mensagemDeErro } from '../../services/api'
import { getUsuario } from '../../services/sessao'
import styles from './Banca.module.css'

export default function Banca() {
  const usuario = getUsuario()
  const [materias, setMaterias] = useState([])
  const [idMateria, setIdMateria] = useState('')
  const [questoes, setQuestoes] = useState([])
  const [atual, setAtual] = useState(0)
  const [escolhida, setEscolhida] = useState('')
  const [resultado, setResultado] = useState(null)   // { acertou, letraCorreta }
  const [placar, setPlacar] = useState({ respondidas: 0, acertos: 0 })
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await api.get('/materias')
        setMaterias(resposta.data)
      } catch (erro) {
        setErro(mensagemDeErro(erro))
      }
    }
    carregar()
  }, [])

  async function sortear() {
    setErro('')
    try {
      const resposta = await api.get('/questoes/banca', { params: { materia: idMateria || undefined, quantidade: 5 } })
      setQuestoes(resposta.data)
      setAtual(0)
      setEscolhida('')
      setResultado(null)
      setPlacar({ respondidas: 0, acertos: 0 })
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
  }

  async function responder() {
    try {
      const questao = questoes[atual]
      const resposta = await api.post(`/questoes/${questao.idQuestao}/responder`, { idUsuario: usuario.idUsuario, letra: escolhida })
      setResultado(resposta.data)
      setPlacar({ respondidas: placar.respondidas + 1, acertos: placar.acertos + (resposta.data.acertou ? 1 : 0) })
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
  }

  function proxima() {
    setAtual(atual + 1)
    setEscolhida('')
    setResultado(null)
  }

  const questao = questoes[atual]
  const terminou = questoes.length > 0 && atual >= questoes.length

  function classeAlternativa(letra) {
    if (!resultado) return letra === escolhida ? styles.selecionada : ''
    if (letra === resultado.letraCorreta) return styles.correta
    if (letra === escolhida) return styles.errada
    return styles.apagada
  }

  return (
    <>
      <h1 className="titulo-pagina">Banca de questões</h1>
      <p className="subtitulo-pagina">Escolha a matéria, sorteie 5 questões e responda uma por vez.</p>

      <div className={`cartao mb-4 ${styles.filtro}`}>
        <select className="form-select" value={idMateria} onChange={(e) => setIdMateria(e.target.value)} aria-label="Matéria">
          <option value="">Todas as matérias</option>
          {materias.map((m) => <option key={m.idMateria} value={m.idMateria}>{m.nome}</option>)}
        </select>
        <button className="btn btn-limao" onClick={sortear}><i className="fa-solid fa-shuffle me-2"></i>Sortear questões</button>
        {questoes.length > 0 && (
          <span className={styles.placar}>
            <i className="fa-solid fa-trophy me-1"></i>{placar.acertos} de {placar.respondidas} certas
          </span>
        )}
      </div>

      {erro && <div className="alerta-erro mb-3">{erro}</div>}

      {questoes.length === 0 && !erro && (
        <div className="cartao text-center texto-suave">
          <i className="fa-solid fa-bolt fa-2x mb-2" style={{ color: 'var(--azul-royal)' }}></i>
          <p className="mb-0">Clique em "Sortear questões" para começar.</p>
        </div>
      )}

      {questao && (
        <div className="cartao">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <span className="etiqueta">Questão {atual + 1} de {questoes.length}</span>
            <span className="etiqueta etiqueta-limao">{questao.materia}</span>
            <span className="etiqueta etiqueta-creme">{questao.vestibular} {questao.ano}</span>
          </div>
          <p className={`texto-quebrado ${styles.enunciado}`}>{questao.enunciado}</p>

          {questao.alternativas.map((a) => (
            <button key={a.letra} className={`${styles.alternativa} ${classeAlternativa(a.letra)}`}
              onClick={() => !resultado && setEscolhida(a.letra)} disabled={!!resultado}>
              <strong>{a.letra}</strong>
              <span>{a.texto}</span>
            </button>
          ))}

          {resultado && (
            <div className={`mt-3 ${resultado.acertou ? 'alerta-sucesso' : 'alerta-erro'}`}>
              {resultado.acertou ? 'Parabéns, você acertou!' : `Resposta errada. A alternativa correta é a ${resultado.letraCorreta}.`}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-3">
            <small className="texto-suave">Fonte: {questao.fonte}</small>
            {!resultado
              ? <button className="btn btn-azul" onClick={responder} disabled={!escolhida}>Responder</button>
              : <button className="btn btn-limao" onClick={proxima}>Próxima <i className="fa-solid fa-arrow-right ms-1"></i></button>}
          </div>
        </div>
      )}

      {terminou && (
        <div className="cartao text-center">
          <h2 className="h4">Bloco concluído!</h2>
          <p className="texto-suave">Você acertou {placar.acertos} de {placar.respondidas} questões.</p>
          <button className="btn btn-limao" onClick={sortear}>Sortear mais questões</button>
        </div>
      )}
    </>
  )
}
