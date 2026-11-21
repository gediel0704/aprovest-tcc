import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import QuestaoForm from '../../components/QuestaoForm/QuestaoForm'
import api, { mensagemDeErro } from '../../services/api'

// UC Manter Questão - Alterar
export default function EditarQuestao() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [questao, setQuestao] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await api.get(`/questoes/${id}`)
        setQuestao(resposta.data)
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
      await api.put(`/questoes/${id}`, dados)
      navigate('/admin/questoes')
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <>
      <Link to="/admin/questoes" className="small"><i className="fa-solid fa-arrow-left me-1"></i>Questões</Link>
      <h1 className="titulo-pagina mt-2">Alterar questão {id}</h1>
      <p className="subtitulo-pagina">Altere os campos desejados e salve.</p>
      {questao
        ? <QuestaoForm inicial={questao} onSalvar={salvar} salvando={salvando} erro={erro} textoBotao="Salvar alterações" />
        : erro && <div className="alerta-erro">{erro}</div>}
    </>
  )
}
