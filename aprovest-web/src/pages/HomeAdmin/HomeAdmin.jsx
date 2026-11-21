import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CartaoEstatistica from '../../components/CartaoEstatistica/CartaoEstatistica'
import api, { mensagemDeErro } from '../../services/api'

const ATALHOS = [
  { para: '/admin/questoes/nova', icone: 'fa-plus', titulo: 'Cadastrar questão', texto: 'Adicione uma nova questão ao banco.' },
  { para: '/admin/questoes', icone: 'fa-list-check', titulo: 'Consultar questões', texto: 'Pesquise, altere ou exclua questões.' },
  { para: '/admin/mensagens', icone: 'fa-envelope', titulo: 'Mensagens de contato', texto: 'Leia e responda o Fale Conosco.' },
  { para: '/admin/usuarios', icone: 'fa-users', titulo: 'Usuários', texto: 'Veja os alunos e ative ou inative contas.' },
]

export default function HomeAdmin() {
  const [resumo, setResumo] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await api.get('/admin/resumo')
        setResumo(resposta.data)
      } catch (erro) {
        setErro(mensagemDeErro(erro))
      }
    }
    carregar()
  }, [])

  return (
    <>
      <h1 className="titulo-pagina">Painel do administrador</h1>
      <p className="subtitulo-pagina">Resumo do sistema e atalhos para as tarefas mais comuns.</p>
      {erro && <div className="alerta-erro mb-3">{erro}</div>}

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3"><CartaoEstatistica icone="fa-list-check" titulo="Questões cadastradas" valor={resumo?.questoes ?? '-'} /></div>
        <div className="col-sm-6 col-xl-3"><CartaoEstatistica icone="fa-user-graduate" titulo="Alunos" valor={resumo?.alunos ?? '-'} cor="limao" /></div>
        <div className="col-sm-6 col-xl-3"><CartaoEstatistica icone="fa-envelope" titulo="Mensagens novas" valor={resumo?.mensagensNovas ?? '-'} cor="creme" /></div>
        <div className="col-sm-6 col-xl-3"><CartaoEstatistica icone="fa-check-double" titulo="Respostas dos alunos" valor={resumo?.respostas ?? '-'} /></div>
      </div>

      <h2 className="h5 mb-3">Atalhos</h2>
      <div className="row g-3">
        {ATALHOS.map((a) => (
          <div className="col-md-6 col-xl-3" key={a.para}>
            <Link to={a.para} className="cartao d-block h-100 text-reset">
              <i className={`fa-solid ${a.icone} fa-lg mb-2`} style={{ color: 'var(--azul-royal)' }}></i>
              <h3 className="h6 mb-1">{a.titulo}</h3>
              <p className="texto-suave small mb-0">{a.texto}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
