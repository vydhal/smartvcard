<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 pt-10 pb-10">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Admin Login</h1>
        <p class="text-gray-500 text-sm">Área exclusiva para gestão da plataforma.</p>
      </div>

      <form @submit.prevent="login" class="space-y-4">
        <div class="relative">
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="Email Administrativo" 
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          >
        </div>

        <div class="relative">
          <input 
            v-model="form.senha" 
            :type="showPassword ? 'text' : 'password'" 
            required 
            placeholder="Senha" 
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          >
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button type="button" @click="showPassword = !showPassword" class="p-1 text-gray-400 hover:text-gray-800">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-xl shadow-md mt-4 transition"
        >
          {{ loading ? 'Entrando...' : 'Acessar Painel' }}
        </button>
      </form>
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
        const response = await fetch(`${process.env.NUXT_ENV_API_URL || 'http://localhost:3001'}/empresas/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || 'Erro no login');

        localStorage.setItem('admin_token', data.token);
        this.$router.push('/admin');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: error.message,
          confirmButtonColor: '#1f2937'
        });
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
