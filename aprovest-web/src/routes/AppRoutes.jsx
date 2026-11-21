import { Route, Routes } from 'react-router-dom'

import LayoutPublico from '../components/LayoutPublico/LayoutPublico'
import LayoutPainel from '../components/LayoutPainel/LayoutPainel'
import RotaProtegida from '../components/RotaProtegida/RotaProtegida'

// Páginas públicas
import Home from '../pages/Home/Home'
import Sobre from '../pages/Sobre/Sobre'
import Servicos from '../pages/Servicos/Servicos'
import Ajuda from '../pages/Ajuda/Ajuda'
import Contato from '../pages/Contato/Contato'
import Privacidade from '../pages/Privacidade/Privacidade'
import Termos from '../pages/Termos/Termos'
import Login from '../pages/Login/Login'
import Cadastro from '../pages/Cadastro/Cadastro'
import EsqueciSenha from '../pages/EsqueciSenha/EsqueciSenha'
import NaoEncontrada from '../pages/NaoEncontrada/NaoEncontrada'

// Área do aluno
import HomeAluno from '../pages/HomeAluno/HomeAluno'
import Banca from '../pages/Banca/Banca'
import Simulados from '../pages/Simulados/Simulados'
import ListarRedacao from '../pages/ListarRedacao/ListarRedacao'
import NovaRedacao from '../pages/NovaRedacao/NovaRedacao'
import EditarRedacao from '../pages/EditarRedacao/EditarRedacao'
import CorrecaoRedacao from '../pages/CorrecaoRedacao/CorrecaoRedacao'
import Desempenho from '../pages/Desempenho/Desempenho'
import Perfil from '../pages/Perfil/Perfil'

// Área do administrador
import HomeAdmin from '../pages/HomeAdmin/HomeAdmin'
import ListarQuestao from '../pages/ListarQuestao/ListarQuestao'
import NovaQuestao from '../pages/NovaQuestao/NovaQuestao'
import EditarQuestao from '../pages/EditarQuestao/EditarQuestao'
import ListarUsuario from '../pages/ListarUsuario/ListarUsuario'
import MensagensContato from '../pages/MensagensContato/MensagensContato'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<LayoutPublico />}>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/ajuda" element={<Ajuda />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/privacidade" element={<Privacidade />} />
        <Route path="/termos" element={<Termos />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>

      <Route path="/aluno" element={<RotaProtegida perfil="ALUNO"><LayoutPainel perfil="ALUNO" /></RotaProtegida>}>
        <Route index element={<HomeAluno />} />
        <Route path="banca" element={<Banca />} />
        <Route path="simulados" element={<Simulados />} />
        <Route path="redacoes" element={<ListarRedacao />} />
        <Route path="redacoes/nova" element={<NovaRedacao />} />
        <Route path="redacoes/:id/editar" element={<EditarRedacao />} />
        <Route path="redacoes/:id/correcao" element={<CorrecaoRedacao />} />
        <Route path="desempenho" element={<Desempenho />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>

      <Route path="/admin" element={<RotaProtegida perfil="ADMIN"><LayoutPainel perfil="ADMIN" /></RotaProtegida>}>
        <Route index element={<HomeAdmin />} />
        <Route path="questoes" element={<ListarQuestao />} />
        <Route path="questoes/nova" element={<NovaQuestao />} />
        <Route path="questoes/:id/editar" element={<EditarQuestao />} />
        <Route path="usuarios" element={<ListarUsuario />} />
        <Route path="mensagens" element={<MensagensContato />} />
      </Route>
    </Routes>
  )
}
