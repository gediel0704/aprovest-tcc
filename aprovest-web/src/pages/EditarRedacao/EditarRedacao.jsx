import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import RedacaoForm from '../../components/RedacaoForm/RedacaoForm'
import api, { mensagemDeErro } from '../../services/api'

export default function EditarRedacao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [redacao, setRedacao] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await api.get(`/redacoes/${id}`)
        setRedacao(resposta.data)
      } catch (erro) {
        setErro(mensagemDeErro(erro))
      }
    }
    carregar()
  }, [id])

  async function salvar(dados) {
    setErro('')
    setSalvando(true)
    try {
      await api.put(`/redacoes/${id}`, { ...dados, idUsuario: redacao.idUsuario })
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
      <h1 className="titulo-pagina mt-2">Editar redação</h1>
      <p className="subtitulo-pagina">Altere o texto e salve novamente.</p>
      {redacao
        ? <RedacaoForm inicial={redacao} onSalvar={salvar} salvando={salvando} erro={erro} />
        : erro && <div className="alerta-erro">{erro}</div>}
    </>
  )
}
