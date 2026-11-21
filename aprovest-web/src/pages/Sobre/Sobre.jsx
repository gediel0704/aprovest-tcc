import PaginaInstitucional from '../../components/PaginaInstitucional/PaginaInstitucional'
import styles from './Sobre.module.css'

const EQUIPE = [
  ['Gediel França Terlesqui', 'Fundador, Fullstack e Supervisor'],
  ['Isabella de Oliveira Celestino Almeida', 'Fundadora, CMO e Front-End'],
  ['Livia Ivanira da Silveira Ponte', 'Fundadora e DBA'],
  ['Nicole de Oliveira Justo', 'Fundadora e ADM'],
  ['Vinicius Nunes Mendonça Gonçalves', 'Fundador e Fullstack'],
]

const PILARES = [
  ['fa-bullseye', 'Objetivo', 'Desenvolver um site que ajude estudantes a se preparar para o ENEM, a FUVEST e a Unicamp, reunindo questões oficiais, um caderno de redações e o acompanhamento do desempenho em um só lugar.'],
  ['fa-scale-balanced', 'Justificativa', 'Muitos estudantes não têm acesso a cursinhos e estudam de forma desorganizada, sem saber em quais matérias precisam melhorar. Um site gratuito, que funciona no computador e no celular, facilita a organização dos estudos.'],
  ['fa-building-columns', 'Fontes oficiais', 'As questões cadastradas vêm das provas oficiais do INEP (ENEM) e da FUVEST, e cada uma informa de qual prova foi tirada.'],
  ['fa-laptop-code', 'Tecnologias', 'Site em React com Bootstrap, API em Java com Spring Boot e banco de dados Microsoft SQL Server.'],
]

const ODS = [
  {
    numero: 4, cor: '#C5192D', nome: 'Educação de qualidade', fonte: 'https://brasil.un.org/pt-br/sdgs/4',
    relacao: 'Apoia o estudante na preparação para o ensino superior, com conteúdo de qualidade e acesso gratuito.',
  },
  {
    numero: 10, cor: '#DD1367', nome: 'Redução das desigualdades', fonte: 'https://brasil.un.org/pt-br/sdgs/10',
    relacao: 'Aproxima a preparação para o vestibular de quem não pode pagar um cursinho, pelo computador ou pelo celular.',
  },
]

export default function Sobre() {
  return (
    <PaginaInstitucional etiqueta="Projeto de TCC · Técnico em Informática · INF2CM" titulo="Sobre o AproVest"
      subtitulo="O AproVest nasceu na Fundação Instituto de Educação de Barueri (FIEB), unidade Brasílio Flores de Azevedo, como Trabalho de Conclusão de Curso.">
      <div className="row g-4">
        {PILARES.map(([icone, titulo, texto]) => (
          <div className="col-md-6" key={titulo}>
            <div className="cartao h-100">
              <span className={styles.icone}><i className={`fa-solid ${icone}`}></i></span>
              <h2 className="h5">{titulo}</h2>
              <p className="texto-suave mb-0">{texto}</p>
            </div>
          </div>
        ))}
      </div>

      <section id="ods" className="mt-5">
        <h2 className="h3">Objetivos de Desenvolvimento Sustentável</h2>
        <p className="texto-suave">O projeto se relaciona com a Agenda 2030 da Organização das Nações Unidas (ONU).</p>
        <div className="row g-4">
          {ODS.map((o) => (
            <div className="col-md-6" key={o.numero}>
              <div className={`cartao h-100 ${styles.ods}`}>
                <div className={styles.odsNumero} style={{ background: o.cor }}><small>ODS</small>{o.numero}</div>
                <div>
                  <h3 className="h5 mb-2">{o.nome}</h3>
                  <p className="mb-2">{o.relacao}</p>
                  <a href={o.fonte} target="_blank" rel="noreferrer" className="small">
                    <i className="fa-solid fa-arrow-up-right-from-square me-1"></i>Fonte: ONU Brasil
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h2 className="h3 mb-3">Equipe</h2>
        <div className="row g-3">
          {EQUIPE.map(([nome, funcao]) => (
            <div className="col-sm-6 col-lg-4" key={nome}>
              <div className={`cartao ${styles.membro}`}>
                <span>{nome.split(' ').map((p) => p[0]).slice(0, 2).join('')}</span>
                <div>
                  <strong>{nome}</strong>
                  <small>{funcao}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PaginaInstitucional>
  )
}
