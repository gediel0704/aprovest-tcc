import PaginaInstitucional from '../../components/PaginaInstitucional/PaginaInstitucional'

const SECOES = [
  ['Quem somos', 'O AproVest é um projeto acadêmico de TCC do Curso Técnico em Informática da FIEB - ITB Brasílio Flores de Azevedo (Barueri - SP). Esta página explica como os dados pessoais são tratados, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).'],
  ['Dados coletados', 'No cadastro: nome, e-mail, senha e o vestibular desejado. No uso do site: respostas às questões e redações. No Fale Conosco: nome, e-mail e mensagem.'],
  ['Para que usamos', 'Para permitir o acesso à conta, mostrar o desempenho do aluno, guardar as redações e responder às mensagens de contato. Os dados não são vendidos nem usados para propaganda.'],
  ['Segurança', 'A senha é guardada criptografada (BCrypt), ou seja, nem a equipe consegue ver a senha original.'],
  ['Seus direitos', 'O aluno pode consultar e corrigir seus dados na página Meu perfil e pedir a exclusão da conta pelo Fale Conosco.'],
]

export default function Privacidade() {
  return (
    <PaginaInstitucional etiqueta="LGPD · Lei nº 13.709/2018" titulo="Política de Privacidade" subtitulo="Atualizada em novembro de 2026.">
      <div className="cartao">
        {SECOES.map(([titulo, texto]) => (
          <section key={titulo} className="mb-4">
            <h2 className="h5">{titulo}</h2>
            <p className="texto-suave mb-0">{texto}</p>
          </section>
        ))}
      </div>
    </PaginaInstitucional>
  )
}
