import { Link } from 'react-router-dom'
import PaginaInstitucional from '../../components/PaginaInstitucional/PaginaInstitucional'

const SERVICOS = [
  { icone: 'fa-bolt', titulo: 'Banca de questões', publico: 'Aluno', texto: 'Questões oficiais sorteadas por matéria. Ao responder, o site mostra na hora se você acertou e qual era a alternativa correta.' },
  { icone: 'fa-pen-nib', titulo: 'Caderno de redações', publico: 'Aluno', texto: 'Escreva redações com os temas dos vestibulares, salve como rascunho e envie quando estiver pronta.' },
  { icone: 'fa-robot', titulo: 'Correção de redação', publico: 'Em desenvolvimento', texto: 'Correção nas cinco competências do ENEM. A tela já está pronta e a correção automática será a próxima etapa do projeto.' },
  { icone: 'fa-stopwatch', titulo: 'Simulados', publico: 'Em desenvolvimento', texto: 'Provas com tempo marcado, como no dia do vestibular.' },
  { icone: 'fa-chart-line', titulo: 'Desempenho', publico: 'Aluno', texto: 'Total de questões respondidas, acertos e aproveitamento por matéria.' },
  { icone: 'fa-list-check', titulo: 'Banco de questões', publico: 'Administrador', texto: 'Cadastro, consulta, alteração e exclusão das questões e das suas alternativas.' },
]

export default function Servicos() {
  return (
    <PaginaInstitucional etiqueta="Serviços" titulo="O que o AproVest oferece"
      subtitulo="Ferramentas para estudar com organização, do primeiro exercício até o dia da prova.">
      <div className="row g-4">
        {SERVICOS.map((s) => (
          <div className="col-md-6 col-lg-4" key={s.titulo}>
            <div className="cartao h-100">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <span className="etiqueta"><i className={`fa-solid ${s.icone} me-1`}></i>{s.titulo}</span>
                <span className={`etiqueta ${s.publico === 'Em desenvolvimento' ? 'etiqueta-creme' : 'etiqueta-limao'}`}>{s.publico}</span>
              </div>
              <p className="texto-suave mb-0">{s.texto}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-5">
        <Link to="/cadastro" className="btn btn-limao btn-lg">Criar minha conta</Link>
      </div>
    </PaginaInstitucional>
  )
}
