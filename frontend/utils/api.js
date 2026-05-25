const BASE_URL = process.env.NUXT_ENV_API_URL || 'http://localhost:3001'

function getHeaders(auth = false) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const token = typeof localStorage !== 'undefined'
      ? (localStorage.getItem('user_token') || localStorage.getItem('admin_token'))
      : null
    if (token) headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

async function request(method, path, body = null, auth = false) {
  const opts = { method, headers: getHeaders(auth) }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${BASE_URL}${path}`, opts)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Erro ${res.status}`)
  return data
}

export async function uploadImage(chave, tipo, blob) {
  const token = typeof localStorage !== 'undefined'
    ? (localStorage.getItem('user_token') || localStorage.getItem('admin_token'))
    : null
  const form = new FormData()
  form.append('tipo', tipo)
  form.append('file', blob)
  const res = await fetch(`${BASE_URL}/cartoes/acesso/${chave}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Erro ${res.status}`)
  return data
}

// Stubs for legacy imports
export const createAvatar = async () => null
export const checkLicense = async () => ({ status: 200, data: {} })
export const saveToGoogleSheet = async () => ({ code: 200 })
export const payToDownloadZip = async () => {}
export const redeemTheCode = async () => ({ status: 200, data: {} })

export const api = {
  // Auth - Usuário
  register: (body) => request('POST', '/usuarios/register', body),
  login: (body) => request('POST', '/usuarios/login', body),
  meusCartoes: () => request('GET', '/usuarios/meus-cartoes', null, true),

  // Auth - Admin
  adminLogin: (body) => request('POST', '/empresas/login', body),
  criarEmpresa: (body) => request('POST', '/empresas', body),

  // Cartões
  getCartao: (chave) => request('GET', `/cartoes/acesso/${chave}`),
  updateCartao: (chave, body) => request('PUT', `/cartoes/acesso/${chave}`, body, true),

  // Admin
  gerarChave: () => request('POST', '/admin/gerar-chave', {}, true),
  listarCartoes: () => request('GET', '/admin/cartoes', null, true),

  // Produtos
  getProdutos: () => request('GET', '/produtos'),

  // Analytics
  meusAnalytics: () => request('GET', '/usuarios/meus-analytics', null, true),
  registrarVisualizacao: (chave) => request('POST', '/cartoes/acesso/' + chave + '/view'),
}
