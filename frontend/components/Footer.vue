<template>
  <footer class="mt-16 mx-4 pb-8 flex flex-col items-center">
    <a href="/">
      <div
        style="height: 90px; width: 160px"
        class="mb-4"
        v-html="require(`~/assets/icons/footer_logo.svg?include`)"
      ></div>
    </a>

    <p class="text-sm text-gray-400 mb-3">
      Copyright © 2025
      <a href="/" class="text-white hover:text-green-400 transition-colors duration-200">Simplisoft</a>
    </p>

    <p class="text-xs text-gray-500 text-center space-x-3">
      <a href="/privacy-policy" class="hover:text-green-400 transition-colors duration-200">Política de Privacidade</a>
      <span>|</span>
      <a href="/terms-of-service" class="hover:text-green-400 transition-colors duration-200">Termos de Serviço</a>
      <span>|</span>
      <a href="/cookie-policy" class="hover:text-green-400 transition-colors duration-200">Política de Cookies</a>
      <span>|</span>
      <a href="/customer-support" class="hover:text-green-400 transition-colors duration-200">Suporte</a>
    </p>
  </footer>
</template>

<script>
export default {}
</script>
