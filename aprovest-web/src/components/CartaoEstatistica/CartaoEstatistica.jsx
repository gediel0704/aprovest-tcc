import styles from './CartaoEstatistica.module.css'

// props: icone, titulo, valor, detalhe, cor ('azul' | 'limao' | 'creme')
export default function CartaoEstatistica({ icone, titulo, valor, detalhe, cor = 'azul' }) {
  return (
    <div className={`cartao ${styles.cartao}`}>
      <span className={`${styles.icone} ${styles[cor]}`}>
        <i className={`fa-solid ${icone}`}></i>
      </span>
      <div>
        <span className={styles.titulo}>{titulo}</span>
        <strong className={styles.valor}>{valor}</strong>
        {detalhe && <small className="texto-suave">{detalhe}</small>}
      </div>
    </div>
  )
}
