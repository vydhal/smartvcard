<template>
  <div class="min-h-screen bg-blue-50 flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 pt-10 pb-10">

      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Nova senha</h1>
        <p class="text-gray-500 text-sm">Digite e confirme sua nova senha abaixo.</p>
      </div>

      <div v-if="sucesso" class="text-center py-4">
        <div class="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <svg class="h-10 w-10 text-green-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-green-700 font-semibold">Senha redefinida com sucesso!</p>
        </div>
        <nuxt-link to="/login" class="w-full block text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition">
          Fazer login
        </nuxt-link>
      </div>

      <form v-else @submit.prevent="resetar" class="space-y-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <input
            v-model="nova_senha"
            :type="showPassword ? 'text' : 'password'"
            required
            minlength="6"
            placeholder="Nova senha (mín. 6 caracteres)"
            class="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          >
          <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500">
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
          </button>
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <input
            v-model="confirmar_senha"
            :type="showPassword ? 'text' : 'password'"
            required
            placeholder="Confirmar nova senha"
            class="w-full pl-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          >
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition"
        >
          {{ loading ? 'Redefinindo...' : 'Redefinir Senha' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <nuxt-link to="/login" class="text-blue-500 text-sm hover:underline">Voltar ao login</nuxt-link>
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
      nova_senha: '',
      confirmar_senha: '',
      showPassword: false,
      loading: false,
      sucesso: false,
      token: ''
    }
  },
  mounted() {
    this.token = this.$route.query.token || ''
    if (!this.token) {
      Swal.fire({ icon: 'error', title: 'Link inválido', text: 'Token de redefinição não encontrado.', confirmButtonColor: '#3b82f6' })
        .then(() => this.$router.push('/login'))
    }
  },
  methods: {
    async resetar() {
      if (this.nova_senha !== this.confirmar_senha) {
        Swal.fire({ icon: 'error', title: 'Senhas diferentes', text: 'As senhas não coincidem.', confirmButtonColor: '#3b82f6' })
        return
      }
      this.loading = true
      try {
        const res = await fetch((process.env.NUXT_ENV_API_URL || 'http://localhost:3001') + '/usuarios/resetar-senha', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: this.token, nova_senha: this.nova_senha })
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erro ao redefinir senha')
        this.sucesso = true
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Erro', text: err.message, confirmButtonColor: '#3b82f6' })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
