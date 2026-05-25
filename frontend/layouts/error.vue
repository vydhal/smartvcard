<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white px-4">
    <div class="text-center max-w-md">
      <div class="text-8xl font-black text-green-500 mb-4">
        {{ error.statusCode || '?' }}
      </div>

      <h1 class="text-2xl font-bold mb-3">
        {{ error.statusCode === 404 ? 'Página não encontrada' : 'Algo deu errado' }}
      </h1>

      <p class="text-gray-400 mb-8 text-sm">
        {{ error.statusCode === 404
          ? 'O endereço que você tentou acessar não existe ou foi removido.'
          : 'Ocorreu um erro inesperado. Tente novamente em instantes.' }}
      </p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <nuxt-link
          to="/"
          class="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          Voltar ao início
        </nuxt-link>
        <nuxt-link
          to="/dashboard"
          class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
        >
          Meu painel
        </nuxt-link>
      </div>

      <div class="mt-16 opacity-40">
        <div style="height:48px;width:80px" class="mx-auto" v-html="require('~/assets/icons/logo.svg?include')"></div>
        <p class="text-xs mt-2">Simplisoft · Smart vCard</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'error',
  layout: 'blank',
  props: {
    error: {
      type: Object,
      default: () => ({ statusCode: 404 })
    }
  }
}
</script>
