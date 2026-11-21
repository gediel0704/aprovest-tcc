import { useState } from 'react'
import { Link } from 'react-router-dom'
import PaginaInstitucional from '../../components/PaginaInstitucional/PaginaInstitucional'
import styles from './Ajuda.module.css'

const PERGUNTAS = [
  { pergunta: 'O AproVest é gratuito?', resposta: 'Sim. Basta criar uma conta de aluno para usar a banca de questões, o caderno de redações e o desempenho.' },
  { pergunta: 'Como crio minha conta?', resposta: 'Clique em "Criar conta", informe nome, e-mail, senha e o vestibular que você vai prestar.' },
  { pergunta: 'De onde vêm as questões?', resposta: 'Das provas oficiais do ENEM (INEP) e da FUVEST. Cada questão mostra a prova e o ano de origem.' },
  { pergunta: 'Como funciona a banca de questões?', resposta: 'O site sorteia questões. Você escolhe uma alternativa e clica em "Responder" para ver se acertou e qual era a alternativa correta.' },
  { pergunta: 'Posso editar uma redação depois de salvar?', resposta: 'Sim. Em "Minhas redações", clique em "Editar". Você também pode excluir uma redação.' },
  { pergunta: 'A correção da redação já funciona?', resposta: 'A tela de correção já está pronta, mas a correção automática ainda está em desenvolvimento. Por enquanto ela mostra um exemplo de como o resultado vai aparecer.' },
  { pergunta: 'Esqueci minha senha. E agora?', resposta: 'Na tela de login, clique em "Esqueci minha senha" e informe o seu e-mail.' },
  { pergunta: 'Como falo com a equipe?', resposta: 'Pela página Contato. A mensagem fica registrada e a equipe responde pelo seu e-mail.' },
]

export default function Ajuda() {
  const [busca, setBusca] = useState('')
  const [aberta, setAberta] = useState(null)

  // pesquisa nas perguntas e respostas
  const termo = busca.trim().toLowerCase()
  const resultado = PERGUNTAS.filter((p) => !termo || (p.pergunta + ' ' + p.resposta).toLowerCase().includes(termo))

  return (
    <PaginaInstitucional etiqueta="Central de ajuda" titulo="Como podemos ajudar?"
      subtitulo="Pesquise uma dúvida ou veja as perguntas frequentes.">
      <div className={styles.busca}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <input className="form-control" placeholder="Pesquisar, por exemplo: redação, senha, questões..."
          value={busca} onChange={(e) => setBusca(e.target.value)} aria-label="Pesquisar na central de ajuda" />
      </div>

      <p className="texto-suave mt-3">{resultado.length} resultado(s)</p>

      {resultado.map((p, i) => (
        <div key={p.pergunta} className={`cartao mb-2 ${styles.item}`}>
          <button className={styles.pergunta} onClick={() => setAberta(aberta === i ? null : i)}>
            {p.pergunta}
            <i className={`fa-solid ${aberta === i || termo ? 'fa-minus' : 'fa-plus'}`}></i>
          </button>
          {(aberta === i || termo) && <p className="texto-suave mb-0 mt-2">{p.resposta}</p>}
        </div>
      ))}

      {resultado.length === 0 && (
        <div className="cartao text-center">
          <p className="mb-2">Não encontramos nada sobre "{busca}".</p>
          <Link to="/contato" className="btn btn-azul">Enviar minha dúvida</Link>
        </div>
      )}
    </PaginaInstitucional>
  )
}
