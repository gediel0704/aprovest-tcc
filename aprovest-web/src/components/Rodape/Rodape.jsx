import { Link } from 'react-router-dom'
import Logo from '../Logo/Logo'
import styles from './Rodape.module.css'

export default function Rodape() {
  return (
    <footer className={styles.rodape}>
      <div className="container">
        <div className="row g-4">
          <div className="col-md-5">
            <Logo claro />
            <p className={styles.texto}>
              Plataforma de preparação para o ENEM, a FUVEST e a Unicamp, desenvolvida como Trabalho de
              Conclusão de Curso do Técnico em Informática.
            </p>
          </div>
          <div className="col-6 col-md-3">
            <h6>Navegação</h6>
            <Link to="/sobre">Sobre o projeto</Link>
            <Link to="/servicos">Serviços</Link>
            <Link to="/ajuda">Central de ajuda</Link>
            <Link to="/contato">Fale conosco</Link>
          </div>
          <div className="col-6 col-md-4">
            <h6>Institucional</h6>
            <Link to="/privacidade">Política de privacidade</Link>
            <Link to="/termos">Termos de uso</Link>
            <span className={styles.texto}>
              <i className="fa-solid fa-location-dot me-2"></i>ITB Brasílio Flores de Azevedo - Barueri/SP
            </span>
          </div>
        </div>
        <div className={styles.linha}>
          © 2026 AproVest - TCC do Curso Técnico em Informática (FIEB / ITB), turma INF2CM.
        </div>
      </div>
    </footer>
  )
}
