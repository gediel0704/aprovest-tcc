import styles from './Modal.module.css'

// Janela de confirmação. props: titulo, children (mensagem), textoConfirmar, onConfirmar, onFechar
export default function Modal({ titulo, children, textoConfirmar = 'Confirmar', onConfirmar, onFechar }) {
  return (
    <div className={styles.fundo} onClick={onFechar}>
      <div className={styles.janela} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h5>{titulo}</h5>
        <div className={styles.corpo}>{children}</div>
        <div className={styles.botoes}>
          <button className="btn btn-contorno" onClick={onFechar}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirmar}>{textoConfirmar}</button>
        </div>
      </div>
    </div>
  )
}
