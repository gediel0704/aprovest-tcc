import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import styles from './Home.module.css'

const RECURSOS = [
  { icone: 'fa-bolt', titulo: 'Banca de questões', texto: 'Resolva questões oficiais do ENEM e da FUVEST e veja a resposta certa na hora.' },
  { icone: 'fa-pen-nib', titulo: 'Caderno de redações', texto: 'Escreva, salve e organize suas redações com os temas dos vestibulares.' },
  { icone: 'fa-chart-line', titulo: 'Seu desempenho', texto: 'Acompanhe acertos e aproveitamento em cada matéria.' },
  { icone: 'fa-stopwatch', titulo: 'Simulados', texto: 'Treine com tempo marcado, como no dia da prova.' },
]

export default function Home() {
  const [numeros, setNumeros] = useState(null)

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await api.get('/publico/numeros')
        setNumeros(resposta.data)
      } catch {
        setNumeros(null)
      }
    }
    carregar()
  }, [])

  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="etiqueta etiqueta-limao mb-3">ENEM · FUVEST · UNICAMP</span>
              <h1 className={styles.titulo}>
                Sua aprovação começa com <span className={styles.brilho}>um plano de estudo</span>.
              </h1>
              <p className={styles.texto}>
                O AproVest reúne questões oficiais, um caderno de redações e o acompanhamento do seu
                desempenho em um só lugar, de graça.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/cadastro" className="btn btn-limao btn-lg">Comece agora</Link>
                <Link to="/sobre" className={`btn btn-lg ${styles.botaoClaro}`}>Conheça o projeto</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className={styles.painelExemplo}>
                <span className={styles.rotulo}>Questão do dia</span>
                <p>Em uma progressão aritmética, o 1º termo é 3 e a razão é 4. Qual é o 10º termo?</p>
                <div className={styles.alternativa}>A) 36</div>
                <div className={`${styles.alternativa} ${styles.certa}`}>B) 39 <i className="fa-solid fa-check"></i></div>
                <div className={styles.alternativa}>C) 40</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className={`row g-3 ${styles.numeros}`}>
          <div className="col-6 col-md-3"><strong>{numeros?.questoes ?? '-'}</strong><span>questões oficiais</span></div>
          <div className="col-6 col-md-3"><strong>{numeros?.vestibulares ?? '-'}</strong><span>vestibulares</span></div>
          <div className="col-6 col-md-3"><strong>{numeros?.materias ?? '-'}</strong><span>matérias</span></div>
          <div className="col-6 col-md-3"><strong>{numeros?.alunos ?? '-'}</strong><span>alunos cadastrados</span></div>
        </div>
      </section>

      <section className="container mt-5">
        <h2 className="text-center mb-2">Tudo o que você precisa para estudar</h2>
        <p className="text-center texto-suave mb-4">Ferramentas simples para organizar a sua preparação.</p>
        <div className="row g-4">
          {RECURSOS.map((r) => (
            <div className="col-md-6 col-lg-3" key={r.titulo}>
              <div className={`cartao h-100 ${styles.recurso}`}>
                <span className={styles.iconeRecurso}><i className={`fa-solid ${r.icone}`}></i></span>
                <h5>{r.titulo}</h5>
                <p className="texto-suave mb-0">{r.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mt-5">
        <div className={styles.chamada}>
          <div>
            <h3>Pronto para começar?</h3>
            <p>Crie sua conta, escolha o vestibular e resolva a primeira questão em menos de um minuto.</p>
          </div>
          <Link to="/cadastro" className="btn btn-limao btn-lg">Criar conta grátis</Link>
        </div>
      </section>
    </>
  )
}
