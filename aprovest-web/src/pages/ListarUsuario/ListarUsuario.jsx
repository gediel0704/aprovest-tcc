import { useEffect, useState } from 'react'
import api, { mensagemDeErro } from '../../services/api'
import { getUsuario } from '../../services/sessao'
import { NOMES_STATUS, formatarData } from '../../services/formatos'

export default function ListarUsuario() {
  const logado = getUsuario()
  const [usuarios, setUsuarios] = useState([])
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')

  async function carregar() {
    try {
      const resposta = await api.get('/usuarios')
      setUsuarios(resposta.data)
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  async function alterarStatus(u) {
    try {
      await api.put(`/usuarios/${u.idUsuario}/status`, { status: u.status === 'ATIVO' ? 'INATIVO' : 'ATIVO' })
      carregar()
    } catch (erro) {
      setErro(mensagemDeErro(erro))
    }
  }

  const termo = busca.trim().toLowerCase()
  const lista = usuarios.filter((u) => !termo || u.nome.toLowerCase().includes(termo) || u.email.includes(termo))

  return (
    <>
      <h1 className="titulo-pagina">Usuários</h1>
      <p className="subtitulo-pagina">Alunos e administradores cadastrados no sistema.</p>

      <input className="form-control mb-3" style={{ maxWidth: 380 }} placeholder="Pesquisar por nome ou e-mail"
        value={busca} onChange={(e) => setBusca(e.target.value)} aria-label="Pesquisar usuário" />
      {erro && <div className="alerta-erro mb-3">{erro}</div>}

      <div className="table-responsive">
        <table className="tabela">
          <thead>
            <tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Vestibular</th><th>Cadastro</th><th>Situação</th><th className="text-end">Ação</th></tr>
          </thead>
          <tbody>
            {lista.map((u) => (
              <tr key={u.idUsuario}>
                <td className="fw-bold">{u.nome}</td>
                <td>{u.email}</td>
                <td><span className={`etiqueta ${u.tipo === 'ADMIN' ? '' : 'etiqueta-limao'}`}>{u.tipo === 'ADMIN' ? 'Administrador' : 'Aluno'}</span></td>
                <td>{u.vestibularMeta?.sigla || '-'}</td>
                <td>{formatarData(u.dataCadastro)}</td>
                <td><span className={`etiqueta ${u.status === 'ATIVO' ? 'etiqueta-sucesso' : 'etiqueta-erro'}`}>{NOMES_STATUS[u.status]}</span></td>
                <td className="text-end">
                  {u.idUsuario !== logado.idUsuario && (
                    <button className="btn btn-sm btn-contorno" onClick={() => alterarStatus(u)}>
                      {u.status === 'ATIVO' ? 'Inativar' : 'Ativar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
