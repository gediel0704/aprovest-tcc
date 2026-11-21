import { Link } from 'react-router-dom'
import styles from './Logo.module.css'

// props: claro = true quando a logo fica sobre fundo azul
export default function Logo({ claro = false, link = '/' }) {
  return (
    <Link to={link} className={`${styles.logo} ${claro ? styles.claro : ''}`}>
      <span className={styles.icone}>
        <i className="fa-solid fa-graduation-cap"></i>
      </span>
      <span>
        Apro<span className={styles.vest}>Vest</span>
      </span>
    </Link>
  )
}
