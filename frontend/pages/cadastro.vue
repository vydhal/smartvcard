<template>
  <div class="min-h-screen bg-blue-50 flex items-center justify-center p-4 font-sans">
    <div class="bg-white rounded-3xl shadow-xl w-full max-w-md p-8 pt-10 pb-10">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-blue-500 mb-4">Crie sua conta!</h1>
        <p class="text-gray-600 text-sm leading-relaxed px-4">
          Transforme suas conexões profissionais e potencialize seu networking com cartões virtuais únicos.
        </p>
      </div>

      <form @submit.prevent="register" class="space-y-4">
        
        <!-- Nome Completo -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <input 
            v-model="form.nome" 
            type="text" 
            required 
            placeholder="Nome completo" 
            class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          >
        </div>

        <!-- Email -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          </div>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="Email" 
            class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          >
        </div>

        <!-- Telefone -->
        <div class="relative flex items-center">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div class="pl-12 pr-2 py-3 border border-gray-200 border-r-0 rounded-l-xl bg-gray-50 flex items-center">
            <span>🇧🇷</span>
            <span class="text-xs ml-1 text-gray-500">▼ +55</span>
          </div>
          <input 
            v-model="form.telefone" 
            type="tel" 
            required 
            placeholder="(11) 99999-9999" 
            class="w-full px-4 py-3 rounded-r-xl border border-gray-200 border-l-0 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          >
        </div>

        <!-- Chave de Acesso -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>
          </div>
          <input 
            v-model="form.chave_acesso" 
            type="text" 
            required 
            placeholder="Chave de Acesso (8 dígitos)" 
            class="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          >
          <div class="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-gray-400 hover:text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </div>
        </div>

        <!-- Senha -->
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <input 
            v-model="form.senha" 
            :type="showPassword ? 'text' : 'password'" 
            required 
            placeholder="Senha" 
            class="w-full pl-12 pr-20 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          >
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
            <!-- Generate/Shuffle Password (Optional) -->
            <button type="button" @click="generatePassword" class="p-1 text-gray-400 hover:text-blue-500 bg-gray-50 border border-gray-200 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-2.4c-1.3 0-2.5-.6-3.3-1.7l-3.1-4.3"/><path d="m18 14 4 4-4 4"/></svg>
            </button>
            <!-- Toggle Visibility -->
            <button type="button" @click="showPassword = !showPassword" class="p-1 text-gray-400 hover:text-blue-500">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors duration-200 mt-2"
        >
          {{ loading ? 'Criando Conta...' : 'Criar Conta' }}
        </button>

      </form>

      <div class="mt-8 text-center text-sm text-gray-600">
        Já tem uma conta? <nuxt-link to="/login" class="text-blue-500 font-medium hover:underline">Fazer login</nuxt-link>
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
      form: {
        nome: '',
        email: '',
        telefone: '',
        chave_acesso: '',
        senha: ''
      },
      showPassword: false,
      loading: false
    }
  },
  methods: {
    generatePassword() {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
      let password = "";
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.form.senha = password;
      this.showPassword = true;
    },
    async register() {
      this.loading = true;
      try {
        const response = await fetch(`${process.env.NUXT_ENV_API_URL || 'http://localhost:3001'}/usuarios/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.form)
        });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Erro ao registrar');
        }

        // Save token
        localStorage.setItem('user_token', data.token);
        
        Swal.fire({
          icon: 'success',
          title: 'Passadaaa!',
          text: 'Sua conta foi criada com sucesso, anjo!',
          confirmButtonColor: '#3b82f6'
        }).then(() => {
          this.$router.push('/dashboard');
        });

      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Yukê?!',
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
