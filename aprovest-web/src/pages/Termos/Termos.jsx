import PaginaInstitucional from '../../components/PaginaInstitucional/PaginaInstitucional'

const SECOES = [
  ['Aceite', 'Ao criar uma conta, o usuário declara ter lido e aceitado estes termos e a Política de Privacidade.'],
  ['O serviço', 'O AproVest oferece banca de questões oficiais, caderno de redações e acompanhamento do desempenho para quem vai prestar o ENEM, a FUVEST e a Unicamp. É um projeto acadêmico e gratuito.'],
  ['Conteúdo oficial', 'As questões pertencem às respectivas bancas (INEP e FUVEST) e são reproduzidas com a indicação da fonte, para fins educacionais.'],
  ['Conduta', 'É proibido compartilhar a conta, tentar acessar áreas sem autorização e enviar conteúdo ofensivo nas redações ou no Fale Conosco.'],
  ['Encerramento', 'O usuário pode pedir a exclusão da conta a qualquer momento. Contas que descumprirem estes termos podem ser inativadas pela administração.'],
]

export default function Termos() {
  return (
    <PaginaInstitucional etiqueta="Termos" titulo="Termos de Uso" subtitulo="Atualizados em novembro de 2026.">
      <div className="cartao">
        {SECOES.map(([titulo, texto], i) => (
          <section key={titulo} className="mb-4">
            <h2 className="h5">{i + 1}. {titulo}</h2>
            <p className="texto-suave mb-0">{texto}</p>
          </section>
        ))}
      </div>
    </PaginaInstitucional>
  )
}
