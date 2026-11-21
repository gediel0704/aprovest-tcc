import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import QuestaoForm from '../../components/QuestaoForm/QuestaoForm'
import api, { mensagemDeErro } from '../../services/api'

// UC Manter Questão - Cadastrar
export default function NovaQuestao() {
  const navigate = useNavigate()
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  async function salvar(dados) {
    setErro('')
    setSalvando(true)
    try {
      await api.post('/questoes', dados)
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
      <h1 className="titulo-pagina mt-2">Nova questão</h1>
      <p className="subtitulo-pagina">Preencha o enunciado, os dados da prova e as alternativas.</p>
      <QuestaoForm onSalvar={salvar} salvando={salvando} erro={erro} textoBotao="Cadastrar questão" />
    </>
  )
}
