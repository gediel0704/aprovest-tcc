import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CartaoEstatistica from '../../components/CartaoEstatistica/CartaoEstatistica'
import api from '../../services/api'
import { getUsuario } from '../../services/sessao'
import { formatarData } from '../../services/formatos'
import styles from './HomeAluno.module.css'

export default function HomeAluno() {
  const usuario = getUsuario()
  const [desempenho, setDesempenho] = useState(null)
  const [redacoes, setRedacoes] = useState([])
  const [perfil, setPerfil] = useState(null)

  useEffect(() => {
    async function carregar() {
      try {
        const [d, r, p] = await Promise.all([
          api.get(`/usuarios/${usuario.idUsuario}/desempenho`),
          api.get('/redacoes', { params: { usuario: usuario.idUsuario } }),
          api.get(`/usuarios/${usuario.idUsuario}`),
        ])
        setDesempenho(d.data)
        setRedacoes(r.data)
        setPerfil(p.data)
      } catch {
        setDesempenho(null)
      }
    }
    carregar()
  }, [usuario.idUsuario])

  return (
    <>
      <div className={styles.boasVindas}>
        <div>
          <h1 className="titulo-pagina">Olá, {usuario.nome.split(' ')[0]}!</h1>
          <p className="subtitulo-pagina mb-0">
            {perfil?.vestibularMeta
              ? <>Sua meta: <span className="destaque-limao fw-bold">{perfil.vestibularMeta.sigla}</span>. Vamos estudar?</>
              : 'Escolha o seu vestibular em Meu perfil.'}
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/aluno/banca" className="btn btn-limao"><i className="fa-solid fa-bolt me-2"></i>Resolver questões</Link>
          <Link to="/aluno/redacoes/nova" className="btn btn-azul"><i className="fa-solid fa-pen-nib me-2"></i>Nova redação</Link>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <CartaoEstatistica icone="fa-list-check" titulo="Questões respondidas" valor={desempenho?.respondidas ?? '-'} />
        </div>
        <div className="col-sm-6 col-xl-3">
          <CartaoEstatistica icone="fa-check" titulo="Acertos" valor={desempenho?.acertos ?? '-'} cor="limao" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <CartaoEstatistica icone="fa-percent" titulo="Aproveitamento" valor={desempenho ? `${desempenho.aproveitamento}%` : '-'} cor="creme" />
        </div>
        <div className="col-sm-6 col-xl-3">
          <CartaoEstatistica icone="fa-pen-nib" titulo="Redações" valor={redacoes.length} detalhe={`${redacoes.filter((r) => r.status === 'ENVIADA').length} enviada(s)`} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="cartao h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 mb-0">Últimas respostas</h2>
              <Link to="/aluno/desempenho" className="small">Ver desempenho</Link>
            </div>
            {desempenho?.ultimas?.length ? (
              <ul className={styles.lista}>
                {desempenho.ultimas.slice(0, 5).map((u, i) => (
                  <li key={i}>
                    <span className={`etiqueta ${u.acertou ? 'etiqueta-sucesso' : 'etiqueta-erro'}`}>
                      <i className={`fa-solid ${u.acertou ? 'fa-check' : 'fa-xmark'} me-1`}></i>{u.acertou ? 'Acertou' : 'Errou'}
                    </span>
                    <span>Questão {u.idQuestao} · {u.materia}</span>
                    <small className="texto-suave">{formatarData(u.dataResposta)}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="texto-suave mb-0">Você ainda não respondeu nenhuma questão.</p>
            )}
          </div>
        </div>
        <div className="col-lg-5">
          <div className={`h-100 ${styles.dica}`}>
            <span className="etiqueta etiqueta-limao mb-2">Dica do dia</span>
            <h2 className="h5">Revise o que você errou</h2>
            <p>
              Estudar os erros é uma das formas mais eficientes de aprender. Veja no Desempenho as matérias com
              menor aproveitamento e volte à banca para treinar.
            </p>
            <Link to="/aluno/desempenho" className="btn btn-limao btn-sm">Ver minhas matérias</Link>
          </div>
        </div>
      </div>
    </>
  )
}
