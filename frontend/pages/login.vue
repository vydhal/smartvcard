<template>
  <div class="min-h-screen bg-blue-50 flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 pt-10 pb-10">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-blue-500 mb-2">Bem-vindo(a) de volta!</h1>
        <p class="text-gray-500 text-sm">Acesse sua conta para gerenciar seus cartões virtuais.</p>
      </div>

      <form @submit.prevent="login" class="space-y-4">
        
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="Email" 
            class="w-full pl-12 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          >
        </div>

        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <input 
            v-model="form.senha" 
            :type="showPassword ? 'text' : 'password'" 
            required 
            placeholder="Senha" 
            class="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          >
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button type="button" @click="showPassword = !showPassword" class="p-1 text-gray-400 hover:text-blue-500">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-md mt-4 transition"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

      </form>

      <div class="mt-4 text-center">
        <nuxt-link to="/esqueci-senha" class="text-gray-400 text-sm hover:text-blue-500 hover:underline">Esqueceu sua senha?</nuxt-link>
      </div>

      <div class="mt-4 text-center text-sm text-gray-600">
        Ainda não tem conta? <nuxt-link to="/cadastro" class="text-blue-500 font-medium hover:underline">Registrar com uma Chave</nuxt-link>
      </div>

    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  layout: 'blank',
  data() {
    return {
      form: { email: '', senha: '' },
      showPassword: false,
      loading: false
    }
  },
  methods: {
    async login() {
      this.loading = true;
      try {
        const response = await fetch(`${process.env.NUXT_ENV_API_URL || 'http://localhost:3001'}/usuarios/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Erro no login');

        localStorage.setItem('user_token', data.token);
        this.$router.push('/dashboard');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.message,
          confirmButtonColor: '#3b82f6'
        });
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
