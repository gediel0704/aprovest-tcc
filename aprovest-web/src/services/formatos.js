// Funções para mostrar datas e textos nas telas

export function formatarData(valor) {
  if (!valor) return ''
  return new Date(valor).toLocaleDateString('pt-BR')
}

export function formatarDataHora(valor) {
  if (!valor) return ''
  return new Date(valor).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export function resumir(texto, tamanho = 110) {
  if (!texto) return ''
  return texto.length > tamanho ? texto.slice(0, tamanho).trim() + '...' : texto
}

export const NOMES_STATUS = {
  RASCUNHO: 'Rascunho',
  ENVIADA: 'Enviada',
  CORRIGIDA: 'Corrigida',
  NOVA: 'Nova',
  LIDA: 'Lida',
  RESPONDIDA: 'Respondida',
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  FACIL: 'Fácil',
  MEDIA: 'Média',
  DIFICIL: 'Difícil',
}
