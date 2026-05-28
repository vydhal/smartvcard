<template>
  <div class="min-h-screen bg-blue-50 flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 pt-10 pb-10">

      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Recuperar senha</h1>
        <p class="text-gray-500 text-sm">Informe seu email e enviaremos as instruções de recuperação.</p>
      </div>

      <div v-if="enviado" class="text-center">
        <div class="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <svg class="h-10 w-10 text-green-500 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-green-700 font-semibold mb-1">Email enviado!</p>
          <p class="text-green-600 text-sm">Se esse email estiver cadastrado, você receberá as instruções em breve.</p>
        </div>
        <nuxt-link to="/login" class="text-blue-500 text-sm hover:underline">Voltar ao login</nuxt-link>
      </div>

      <form v-else @submit.prevent="solicitar" class="space-y-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <input
            v-model="email"
            type="email"
            required
            placeholder="Seu email"
            class="w-full pl-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          >
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md transition"
        >
          {{ loading ? 'Enviando...' : 'Enviar instruções' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <nuxt-link to="/login" class="text-gray-400 text-sm hover:text-blue-500 hover:underline">Voltar ao login</nuxt-link>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  layout: 'blank',
  data() {
    return {
      email: '',
      loading: false,
      enviado: false
    }
  },
  methods: {
    async solicitar() {
      this.loading = true
      try {
        await fetch((process.env.NUXT_ENV_API_URL || 'http://localhost:3001') + '/usuarios/esqueci-senha', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email })
        })
        this.enviado = true
      } catch {
        this.enviado = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
