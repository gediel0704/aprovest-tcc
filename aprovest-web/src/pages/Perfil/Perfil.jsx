import { useEffect, useState } from 'react'
import api, { mensagemDeErro } from '../../services/api'
import { getUsuario, salvarUsuario } from '../../services/sessao'
import { formatarData } from '../../services/formatos'

export default function Perfil() {
  const logado = getUsuario()
  const [usuario, setUsuario] = useState(null)
  const [vestibulares, setVestibulares] = useState([])
  const [form, setForm] = useState({ nome: '', idVestibularMeta: '' })
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    async function carregar() {
      try {
        const [u, v] = await Promise.all([api.get(`/usuarios/${logado.idUsuario}`), api.get('/vestibulares')])
        setUsuario(u.data)
        setVestibulares(v.data)
        setForm({ nome: u.data.nome, idVestibularMeta: u.data.idVestibularMeta ?? '' })
      } catch (erro) {
        setErro(mensagemDeErro(erro))
      }
    }
    carregar()
  }, [logado.idUsuario])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setMensagem('')
    try {
      const resposta = await api.put(`/usuarios/${logado.idUsuario}`, {
        nome: form.nome,
        idVestibularMeta: form.idVestibularMeta ? Number(form.idVestibularMeta) : null,
      })
      setUsuario(resposta.data)
      salvarUsuario(resposta.data)
      setMensagem('Perfil atualizado com sucesso.')
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
  }

  return (
    <>
      <h1 className="titulo-pagina">Meu perfil</h1>
      <p className="subtitulo-pagina">Seus dados e o vestibular que você vai prestar.</p>

      <div className="row g-4">
        <div className="col-lg-7">
          <form className="cartao" onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="nome">Nome</label>
            <input id="nome" name="nome" className="form-control mb-3" value={form.nome} onChange={handleChange} required maxLength={100} />

            <label className="form-label" htmlFor="email">E-mail</label>
            <input id="email" className="form-control mb-3" value={usuario?.email || ''} disabled />

            <label className="form-label" htmlFor="idVestibularMeta">Vestibular que vou prestar</label>
            <select id="idVestibularMeta" name="idVestibularMeta" className="form-select" value={form.idVestibularMeta} onChange={handleChange}>
              <option value="">Ainda não decidi</option>
              {vestibulares.map((v) => <option key={v.idVestibular} value={v.idVestibular}>{v.sigla} - {v.nome}</option>)}
            </select>

            {mensagem && <div className="alerta-sucesso mt-3">{mensagem}</div>}
            {erro && <div className="alerta-erro mt-3">{erro}</div>}
            <button className="btn btn-limao mt-3"><i className="fa-solid fa-floppy-disk me-2"></i>Salvar alterações</button>
          </form>
        </div>
        <div className="col-lg-5">
          <div className="cartao">
            <h2 className="h5">Sua conta</h2>
            <p className="mb-1"><span className="texto-suave">Perfil:</span> <strong>Aluno</strong></p>
            <p className="mb-1"><span className="texto-suave">Cadastro em:</span> <strong>{formatarData(usuario?.dataCadastro)}</strong></p>
            <p className="mb-0"><span className="texto-suave">Situação:</span> <span className="etiqueta etiqueta-sucesso">Ativa</span></p>
          </div>
        </div>
      </div>
    </>
  )
}
