<template>
  <header class="bg-gray-900 shadow-md sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        
        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center">
          <nuxt-link to="/" class="flex items-center gap-2 text-white hover:text-green-400 transition">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
            </svg>
            <span class="font-extrabold text-2xl tracking-tight">Smart <span class="text-green-500">vCard</span></span>
          </nuxt-link>
        </div>

        <!-- Desktop Menu -->
        <nav class="hidden md:flex space-x-8">
          <a href="/#marketplace" class="text-gray-300 hover:text-white font-medium transition-colors">Produtos</a>
          <nuxt-link to="/cadastro" class="text-gray-300 hover:text-white font-medium transition-colors">Tenho uma Chave</nuxt-link>
        </nav>

        <!-- CTAs -->
        <div class="hidden md:flex items-center space-x-4">
          <nuxt-link 
            to="/login" 
            class="text-gray-300 hover:text-white font-medium px-4 py-2 transition-colors"
          >
            Entrar
          </nuxt-link>
          <a 
            href="#marketplace"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition-colors shadow-lg"
          >
            Começar Agora
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="text-gray-300 hover:text-white focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Panel -->
    <div v-if="mobileMenuOpen" class="md:hidden bg-gray-800 border-t border-gray-700">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a href="/#marketplace" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Produtos</a>
        <nuxt-link to="/cadastro" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Tenho uma Chave</nuxt-link>
        <nuxt-link to="/login" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Entrar</nuxt-link>
        <a href="#marketplace" class="block w-full text-center mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md transition-colors">
          Começar Agora
        </a>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      mobileMenuOpen: false
    }
  }
}
</script>
