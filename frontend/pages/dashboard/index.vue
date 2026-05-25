<template>
  <div class="min-h-screen bg-gray-50 flex flex-col font-sans">
    
    <!-- Navbar -->
    <header class="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-blue-600">Meus Cartões</h1>
      <button @click="logout" class="text-gray-500 hover:text-red-500 font-medium">Sair</button>
    </header>

    <main class="flex-grow p-6 max-w-5xl mx-auto w-full">
      <div v-if="loading" class="flex justify-center items-center py-20">
        <span class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></span>
      </div>

      <div v-else-if="cartoes.length === 0" class="text-center py-20">
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto">
          <svg class="h-16 w-16 text-gray-300 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <h2 class="text-xl font-bold text-gray-800 mb-2">Nenhum cartão encontrado</h2>
          <p class="text-gray-500 text-sm">Você ainda não vinculou nenhum cartão virtual. Fale com o suporte se isso for um erro.</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="cartao in cartoes" :key="cartao.id" class="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-6 transition flex flex-col h-full">
          
          <div class="flex-grow">
            <div class="flex justify-between items-start mb-4">
              <div class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Cartão Digital
              </div>
              <span v-if="cartao.ativo" class="h-3 w-3 bg-green-400 rounded-full" title="Ativo"></span>
              <span v-else class="h-3 w-3 bg-red-400 rounded-full" title="Inativo"></span>
            </div>
            
            <h3 class="text-lg font-bold text-gray-900 line-clamp-1">{{ cartao.nome_perfil || 'Cartão sem nome' }}</h3>
            <p class="text-gray-500 text-sm mb-4 line-clamp-1">{{ cartao.cargo || 'Cargo não definido' }}</p>
            
            <div class="text-xs text-gray-400 bg-gray-50 p-2 rounded mb-4 font-mono text-center">
              Chave: {{ cartao.chave_acesso }}
            </div>
          </div>

          <div class="mt-auto space-y-2">
            <nuxt-link :to="`/dashboard/${cartao.chave_acesso}`" class="w-full block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-xl transition">
              Editar Cartão
            </nuxt-link>
            <a :target="'_blank'" :href="`/?id=${cartao.chave_acesso}`" class="w-full block text-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 rounded-xl transition">
              Ver Cartão Online
            </a>
          </div>
        </div>
      </div>
    </main>

  </div>
</template>

<script>
export default {
  data() {
    return {
      cartoes: [],
      loading: true
    }
  },
  mounted() {
    const token = localStorage.getItem('user_token')
    if (!token) {
      this.$router.push('/login')
      return
    }
    this.carregarCartoes()
  },
  methods: {
    async carregarCartoes() {
      try {
        const token = localStorage.getItem('user_token')
        const response = await fetch(`${process.env.NUXT_ENV_API_URL || 'http://localhost:3001'}/usuarios/meus-cartoes`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.status === 401 || response.status === 403) {
          this.logout()
          return
        }

        this.cartoes = await response.json()
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    logout() {
      localStorage.removeItem('user_token')
      this.$router.push('/login')
    }
  }
}
</script>
