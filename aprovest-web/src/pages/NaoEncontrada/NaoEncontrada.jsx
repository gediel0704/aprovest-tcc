import { Link } from 'react-router-dom'

export default function NaoEncontrada() {
  return (
    <div className="container text-center" style={{ padding: '5rem 1rem' }}>
      <span className="etiqueta etiqueta-limao mb-3">Erro 404</span>
      <h1>Página não encontrada</h1>
      <p className="texto-suave">O endereço digitado não existe ou foi alterado.</p>
      <Link to="/" className="btn btn-azul mt-2">Voltar para o início</Link>
    </div>
  )
}
