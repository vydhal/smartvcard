<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans">
    <div class="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Smart vCard ✨</h1>
        <p class="text-gray-500 mt-2 text-sm">Personalize seu cartão Vitualll!</p>
      </div>

      <!-- Passo 1: Inserir a Chave -->
      <div v-if="!cartao" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Chave de Acesso Única</label>
          <div class="relative">
            <input 
              v-model="chaveAcesso" 
              :type="mostrarChave ? 'text' : 'password'"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="Ex: ABC-1234"
            />
            <!-- Olhinho de Senha / Acessibilidade -->
            <button 
              @click="mostrarChave = !mostrarChave" 
              class="absolute right-3 top-3 text-gray-400 hover:text-purple-600 focus:outline-none"
            >
              <svg v-if="mostrarChave" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </button>
          </div>
        </div>
        <button 
          @click="buscarCartao" 
          :disabled="loading"
          class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-purple-500/30 flex justify-center items-center"
        >
          <span v-if="loading" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          <span v-else>Acessar Meu Cartão</span>
        </button>
        <p v-if="erro" class="text-red-500 text-sm text-center font-medium">{{ erro }}</p>
      </div>

      <!-- Passo 2: Editar o Cartão -->
      <div v-else class="space-y-5 animate-fade-in">
        <div class="bg-purple-50 border border-purple-100 p-4 rounded-xl mb-6">
          <p class="text-purple-800 text-sm font-semibold">✅ Tá no brilho! Cartão liberado para edição.</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nome de Exibição</label>
          <input v-model="form.nome_perfil" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cargo / Profissão</label>
          <input v-model="form.cargo" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">WhatsApp (com DDD)</label>
          <input v-model="form.whatsapp" type="tel" class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none" placeholder="Ex: 11999999999" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Link Avaliações do Google</label>
          <input v-model="form.link_google_reviews" type="url" class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none" placeholder="https://g.page/r/..." />
          <p class="text-xs text-gray-400 mt-1">Cole aqui o link direto para seus clientes avaliarem você no Google 🌟</p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Mini Bio</label>
          <textarea v-model="form.bio" rows="3" class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400 outline-none"></textarea>
        </div>

        <button 
          @click="salvarCartao" 
          :disabled="saving"
          class="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-pink-500/30 flex justify-center items-center mt-4"
        >
          <span v-if="saving" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          <span v-else>Salvar Alterações 🚀</span>
        </button>
        <p v-if="sucesso" class="text-green-500 text-sm text-center font-medium mt-2">Alterações salvas com sucesso!</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chaveAcesso: '',
      mostrarChave: false,
      cartao: null,
      loading: false,
      saving: false,
      erro: '',
      sucesso: false,
      form: {
        nome_perfil: '',
        cargo: '',
        whatsapp: '',
        link_google_reviews: '',
        bio: ''
      }
    }
  },
  methods: {
    async buscarCartao() {
      if (!this.chaveAcesso) {
        this.erro = "Por favor, digite sua chave de acesso!"
        return
      }
      this.loading = true
      this.erro = ''
      try {
        const response = await fetch(`http://localhost:3001/cartoes/acesso/${this.chaveAcesso}`)
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Cartão não encontrado.')
        }
        
        this.cartao = data
        this.form = {
          nome_perfil: data.nome_perfil || '',
          cargo: data.cargo || '',
          whatsapp: data.whatsapp || '',
          link_google_reviews: data.link_google_reviews || '',
          bio: data.bio || ''
        }
      } catch (err) {
        this.erro = err.message
      } finally {
        this.loading = false
      }
    },
    async salvarCartao() {
      this.saving = true
      this.sucesso = false
      try {
        const response = await fetch(`http://localhost:3001/cartoes/acesso/${this.chaveAcesso}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        })
        const data = await response.json()
        if (!response.ok) throw new Error('Erro ao salvar')
        this.sucesso = true
        setTimeout(() => { this.sucesso = false }, 3000)
      } catch (err) {
        alert("Ops! Houve um erro ao salvar as alterações.")
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
