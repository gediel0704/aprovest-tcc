import { Outlet } from 'react-router-dom'
import MenuPublico from '../MenuPublico/MenuPublico'
import Rodape from '../Rodape/Rodape'

// Estrutura das páginas públicas: menu no topo, conteúdo e rodapé
export default function LayoutPublico() {
  return (
    <>
      <MenuPublico />
      <main>
        <Outlet />
      </main>
      <Rodape />
    </>
  )
}
