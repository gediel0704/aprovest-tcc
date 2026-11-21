import axios from 'axios'

// Endereço da API (Spring Boot). Pode ser trocado criando o arquivo .env com VITE_API_URL=...
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
})

// Mensagem de erro amigável a partir da resposta da API
export function mensagemDeErro(erro) {
  if (erro.response?.data?.mensagem) return erro.response.data.mensagem
  if (!erro.response) return 'Não foi possível falar com a API. Verifique se ela está rodando.'
  return 'Ocorreu um erro. Tente novamente.'
}

export default api
