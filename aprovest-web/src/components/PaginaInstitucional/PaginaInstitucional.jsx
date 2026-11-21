import styles from './PaginaInstitucional.module.css'

// Cabeçalho padrão das páginas institucionais (Sobre, Serviços, Ajuda, Contato...)
export default function PaginaInstitucional({ etiqueta, titulo, subtitulo, children }) {
  return (
    <>
      <section className={styles.cabecalho}>
        <div className="container">
          {etiqueta && <span className="etiqueta etiqueta-limao">{etiqueta}</span>}
          <h1>{titulo}</h1>
          {subtitulo && <p>{subtitulo}</p>}
        </div>
      </section>
      <div className="container mt-4">{children}</div>
    </>
  )
}
