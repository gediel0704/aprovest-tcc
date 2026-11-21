import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RedacaoForm from '../../components/RedacaoForm/RedacaoForm'
import api, { mensagemDeErro } from '../../services/api'
import { getUsuario } from '../../services/sessao'

export default function NovaRedacao() {
  const usuario = getUsuario()
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function salvar(dados) {
    setErro('')
    setSalvando(true)
    try {
      await api.post('/redacoes', { ...dados, idUsuario: usuario.idUsuario })
      navigate('/aluno/redacoes')
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <>
      <Link to="/aluno/redacoes" className="small"><i className="fa-solid fa-arrow-left me-1"></i>Minhas redações</Link>
      <h1 className="titulo-pagina mt-2">Nova redação</h1>
      <p className="subtitulo-pagina">Salve como rascunho para continuar depois ou envie quando terminar.</p>
      <RedacaoForm onSalvar={salvar} salvando={salvando} erro={erro} />
    </>
  )
}
