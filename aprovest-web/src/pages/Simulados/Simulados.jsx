// Tela pronta e navegável. A aplicação do simulado com tempo será implementada na próxima etapa do projeto.
const SIMULADOS = [
  { titulo: 'Simulado ENEM - Linguagens e Ciências Humanas', questoes: 90, tempo: '5h30', vestibular: 'ENEM' },
  { titulo: 'Simulado ENEM - Ciências da Natureza e Matemática', questoes: 90, tempo: '5h', vestibular: 'ENEM' },
  { titulo: 'Simulado FUVEST - 1ª fase', questoes: 90, tempo: '5h', vestibular: 'FUVEST' },
  { titulo: 'Simulado Unicamp - 1ª fase', questoes: 72, tempo: '5h', vestibular: 'UNICAMP' },
]

export default function Simulados() {
  return (
    <>
      <h1 className="titulo-pagina">Simulados</h1>
      <p className="subtitulo-pagina">Provas completas com tempo marcado, como no dia do vestibular.</p>

      <div className="alerta-aviso mb-4">
        <i className="fa-solid fa-person-digging me-2"></i>
        Os simulados estão em desenvolvimento. Enquanto isso, treine na Banca de questões.
      </div>

      <div className="row g-3">
        {SIMULADOS.map((s) => (
          <div className="col-md-6" key={s.titulo}>
            <div className="cartao h-100 d-flex flex-column">
              <span className="etiqueta etiqueta-limao align-self-start mb-2">{s.vestibular}</span>
              <h2 className="h5">{s.titulo}</h2>
              <p className="texto-suave">
                <i className="fa-solid fa-list-ol me-1"></i>{s.questoes} questões
                <i className="fa-solid fa-clock ms-3 me-1"></i>{s.tempo}
              </p>
              <button className="btn btn-contorno mt-auto" disabled>Em breve</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
