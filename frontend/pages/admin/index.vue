<template>
  <div class="min-h-screen bg-gray-100 p-8 font-sans">
    <div class="max-w-6xl mx-auto">

      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Painel do Administrador</h1>
          <p class="text-gray-500">Gerencie chaves de acesso e cartões da plataforma</p>
        </div>
        <div class="flex space-x-3">
          <nuxt-link to="/admin/produtos" class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg shadow transition">
            Produtos
          </nuxt-link>
          <button @click="gerarChave" :disabled="gerando" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg shadow transition">
            {{ gerando ? 'Gerando...' : '+ Nova Chave' }}
          </button>
          <button @click="logout" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow transition">
            Sair
          </button>
        </div>
      </div>

      <!-- Cards de resumo -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="bg-white rounded-xl p-5 shadow text-center">
          <p class="text-3xl font-black text-blue-600">{{ cartoes.length }}</p>
          <p class="text-sm text-gray-500 mt-1">Total de chaves</p>
        </div>
        <div class="bg-white rounded-xl p-5 shadow text-center">
          <p class="text-3xl font-black text-green-600">{{ cartoes.filter(c => c.usuario).length }}</p>
          <p class="text-sm text-gray-500 mt-1">Ativadas por clientes</p>
        </div>
        <div class="bg-white rounded-xl p-5 shadow text-center">
          <p class="text-3xl font-black text-yellow-500">{{ cartoes.filter(c => !c.usuario).length }}</p>
          <p class="text-sm text-gray-500 mt-1">Aguardando cadastro</p>
        </div>
      </div>

      <!-- Filtro e busca -->
      <div class="mb-4 flex flex-col sm:flex-row gap-3">
        <div class="flex gap-2">
          <button v-for="f in ['todos', 'pendentes', 'ativos']" :key="f"
            @click="filtro = f"
            :class="filtro === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'"
            class="px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm border border-gray-200 transition capitalize">
            {{ f }}
          </button>
        </div>
        <div class="relative flex-1 sm:max-w-xs">
          <svg class="absolute inset-y-0 left-3 my-auto h-4 w-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input v-model="busca" type="text" placeholder="Buscar por chave ou cliente…" class="w-full pl-9 pr-3 py-1.5 rounded-full text-sm border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="p-4 text-sm font-semibold text-gray-600">ID</th>
                <th class="p-4 text-sm font-semibold text-gray-600">Chave</th>
                <th class="p-4 text-sm font-semibold text-gray-600">Cliente</th>
                <th class="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th class="p-4 text-sm font-semibold text-gray-600">Gerado em</th>
                <th class="p-4 text-sm font-semibold text-gray-600 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading">
                <td colspan="6" class="p-8 text-center text-gray-500">Carregando...</td>
              </tr>
              <tr v-else-if="cartoesFiltrados.length === 0">
                <td colspan="6" class="p-8 text-center text-gray-400">Nenhuma chave encontrada.</td>
              </tr>
              <tr v-for="cartao in cartoesFiltrados" :key="cartao.id" class="border-b border-gray-100 hover:bg-gray-50 transition">
                <td class="p-4 text-sm text-gray-500">#{{ cartao.id }}</td>
                <td class="p-4">
                  <span class="font-mono font-bold text-sm bg-gray-100 px-2 py-1 rounded tracking-wider">{{ cartao.chave_acesso }}</span>
                </td>
                <td class="p-4 text-sm">
                  <div v-if="cartao.usuario">
                    <p class="font-bold text-gray-800">{{ cartao.usuario.nome }}</p>
                    <p class="text-xs text-gray-400">{{ cartao.usuario.email }}</p>
                  </div>
                  <span v-else class="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Aguardando cadastro
                  </span>
                </td>
                <td class="p-4">
                  <button @click="toggleAtivo(cartao)"
                    :class="cartao.ativo ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'"
                    class="px-2.5 py-0.5 rounded-full text-xs font-semibold transition">
                    {{ cartao.ativo ? 'Ativo' : 'Inativo' }}
                  </button>
                </td>
                <td class="p-4 text-sm text-gray-400">
                  {{ new Date(cartao.criado_em).toLocaleDateString('pt-BR') }}
                </td>
                <td class="p-4 text-center">
                  <div class="flex justify-center gap-3 text-xs font-semibold">
                    <button @click="copiarChave(cartao.chave_acesso)" class="text-blue-500 hover:text-blue-700">Copiar chave</button>
                    <button @click="copiarLinkCadastro(cartao.chave_acesso)" class="text-purple-500 hover:text-purple-700">Link cadastro</button>
                    <button v-if="!cartao.usuario" @click="abrirEnvioEmail(cartao.chave_acesso)" class="text-orange-500 hover:text-orange-700">Enviar convite</button>
                    <a v-if="cartao.usuario" :href="'/c/' + cartao.chave_acesso" target="_blank" class="text-green-600 hover:text-green-800">Ver cartão</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  layout: 'blank',
  data() {
    return {
      cartoes: [],
      loading: true,
      gerando: false,
      filtro: 'todos',
      busca: ''
    }
  },
  computed: {
    cartoesFiltrados() {
      let lista = this.cartoes
      if (this.filtro === 'pendentes') lista = lista.filter(c => !c.usuario)
      else if (this.filtro === 'ativos') lista = lista.filter(c => c.usuario)
      if (this.busca.trim()) {
        const q = this.busca.trim().toLowerCase()
        lista = lista.filter(c =>
          c.chave_acesso.toLowerCase().includes(q) ||
          (c.usuario && c.usuario.nome.toLowerCase().includes(q)) ||
          (c.usuario && c.usuario.email.toLowerCase().includes(q))
        )
      }
      return lista
    }
  },
  mounted() {
    if (!localStorage.getItem('admin_token')) { this.$router.push('/admin/login'); return }
    this.carregarCartoes()
  },
  methods: {
    async carregarCartoes() {
      try {
        const token = localStorage.getItem('admin_token')
        const res = await fetch((process.env.NUXT_ENV_API_URL || 'http://localhost:3001') + '/admin/cartoes', {
          headers: { 'Authorization': 'Bearer ' + token }
        })
        if (res.status === 401 || res.status === 403) { this.logout(); return }
        this.cartoes = await res.json()
      } catch (err) { console.error(err) }
      finally { this.loading = false }
    },
    async gerarChave() {
      this.gerando = true
      try {
        const token = localStorage.getItem('admin_token')
        const res = await fetch((process.env.NUXT_ENV_API_URL || 'http://localhost:3001') + '/admin/gerar-chave', {
          method: 'POST', headers: { 'Authorization': 'Bearer ' + token }
        })
        const data = await res.json()
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Chave Gerada!', text: 'Nova chave: ' + data.chave_acesso })
          this.carregarCartoes()
        } else {
          throw new Error(data.error || 'Erro ao gerar chave')
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Erro', text: err.message })
      } finally { this.gerando = false }
    },
    async toggleAtivo(cartao) {
      const token = localStorage.getItem('admin_token')
      try {
        const res = await fetch((process.env.NUXT_ENV_API_URL || 'http://localhost:3001') + '/admin/cartoes/' + cartao.id + '/toggle', {
          method: 'PATCH', headers: { 'Authorization': 'Bearer ' + token }
        })
        if (res.ok) {
          const data = await res.json()
          cartao.ativo = data.ativo
        }
      } catch { console.error('Erro ao alterar status') }
    },
    copiarChave(chave) {
      navigator.clipboard.writeText(chave)
      Swal.fire({ icon: 'success', title: 'Copiada!', timer: 1200, showConfirmButton: false })
    },
    copiarLinkCadastro(chave) {
      const origin = window.location.origin
      const link = origin + '/cadastro?chave=' + chave
      navigator.clipboard.writeText(link)
      Swal.fire({ icon: 'success', title: 'Link copiado!', text: link, timer: 2500, showConfirmButton: false })
    },
    async abrirEnvioEmail(chave) {
      const { value: email } = await Swal.fire({
        title: 'Enviar convite por email',
        input: 'email',
        inputLabel: 'Email do cliente',
        inputPlaceholder: 'cliente@email.com',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Enviar',
        confirmButtonColor: '#f97316',
        inputValidator: (v) => !v && 'Por favor informe um email.'
      })
      if (!email) return
      try {
        const token = localStorage.getItem('admin_token')
        const res = await fetch((process.env.NUXT_ENV_API_URL || 'http://localhost:3001') + '/admin/enviar-convite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ email, chave })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erro ao enviar')
        Swal.fire({
          icon: 'success',
          title: 'Convite enviado!',
          html: process.env.NUXT_ENV_API_URL
            ? '<p>Email enviado para <strong>' + email + '</strong></p>'
            : '<p>SMTP não configurado. Link para compartilhar manualmente:</p><p style="word-break:break-all;font-size:12px;margin-top:8px;">' + data.link + '</p>',
          confirmButtonColor: '#3b82f6'
        })
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Erro', text: err.message })
      }
    },
    logout() {
      localStorage.removeItem('admin_token')
      this.$router.push('/admin/login')
    }
  }
}
</script>
