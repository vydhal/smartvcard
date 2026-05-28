<template>
  <div class="container relative bg-gray-900 mx-auto text-gray-100" style="max-width: 960px">
    <Header />

    <a href="https://api.whatsapp.com/send?phone=5583991185518" class="fixed bottom-8 right-8 z-50 p-4 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200" target="_blank" rel="noopener noreferrer" aria-label="Fale conosco pelo WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-phone-call">
        <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-10 10l-6.2-6.2a1 1 0 0 0-1.4 0l-1.6 1.6a1 1 0 0 0 0 1.4l6.2 6.2a1 1 0 0 0 1.4 0l1.6-1.6a1 1 0 0 0 0-1.4z"></path>
      </svg>
    </a>

    <!-- HERO SECTION -->
    <div class="px-4 py-32 text-center md:py-48">
      <h1 class="text-4xl md:text-6xl font-extrabold leading-tight text-white">
        O seu cartão de visita digital que impressiona
      </h1>
      <p class="mt-8 text-xl md:text-2xl w-full md:w-3/4 mx-auto text-gray-300">
        Transforme a maneira como você se apresenta. Crie um cartão de visita interativo, moderno e que funciona como seu mini-site pessoal.
      </p>
      <div class="mt-8 flex justify-center gap-4 flex-wrap">
        <a href="#marketplace" class="font-extrabold leading-none text-lg tracking-wide select-none p-5 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-xl">
          Ver Produtos
        </a>
        <nuxt-link to="/cadastro" class="font-bold leading-none text-lg tracking-wide select-none p-5 text-green-500 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-200 shadow-xl border border-green-500">
          Já tenho uma Chave
        </nuxt-link>
      </div>
    </div>

    <!-- MARKETPLACE SECTION -->
    <div id="marketplace" class="px-4 py-24 bg-white text-gray-900 rounded-t-3xl">
      <h2 class="font-extrabold text-4xl text-center mb-4 text-gray-900">
        Nossos Produtos
      </h2>
      <p class="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
        Escolha o formato que mais combina com você. Compre seu produto físico e ganhe acesso instantâneo ao nosso editor de cartão digital!
      </p>

      <div v-if="loading" class="flex justify-center my-12">
        <span class="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"></span>
      </div>

      <div v-else-if="produtos.length === 0" class="text-center text-gray-500 my-12">
        Nenhum produto cadastrado no momento.
      </div>

      <div v-else class="grid md:grid-cols-3 gap-10">
        <div v-for="produto in produtos" :key="produto.id" class="flex flex-col items-center bg-gray-50 rounded-2xl p-6 shadow-md hover:shadow-2xl transition duration-300">
          
          <!-- Imagem -->
          <div class="h-48 w-full flex items-center justify-center mb-6 overflow-hidden">
            <img :src="getImagemUrl(produto.imagem_url)" :alt="produto.nome" class="max-h-full object-contain hover:scale-105 transition duration-300" />
          </div>
          
          <!-- Detalhes -->
          <h3 class="font-bold text-xl text-center mb-2">{{ produto.nome }}</h3>
          <p v-if="produto.descricao" class="text-sm text-gray-500 text-center mb-4 line-clamp-2">{{ produto.descricao }}</p>
          
          <div class="text-center mb-6 flex-grow flex flex-col justify-end">
            <p v-if="produto.preco_promocional" class="text-gray-400 line-through text-sm">de R$ {{ formatPrice(produto.preco) }} por</p>
            <p class="text-3xl font-extrabold text-gray-900">R$ {{ formatPrice(produto.preco_promocional || produto.preco) }}</p>
          </div>

          <!-- Botão Comprar -->
          <a :href="getWhatsappLink(produto.nome)" target="_blank" rel="noopener noreferrer" class="w-full text-center bg-black text-white font-bold py-3 rounded-full hover:bg-gray-800 transition shadow-lg">
            Comprar Agora
          </a>
        </div>
      </div>
    </div>

    <!-- BENEFÍCIOS -->
    <div class="px-4 py-24 bg-gray-900">
      <h2 class="font-extrabold text-3xl text-center mb-12 text-white">
        Benefícios do Smart vCard
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="p-8 rounded-2xl bg-gray-800 shadow-lg border border-gray-700">
          <h3 class="font-bold text-xl mb-3 text-green-400">Economia e Sustentabilidade</h3>
          <p class="text-gray-300">
            Diga adeus ao papel. Nosso cartão digital elimina o custo e o desperdício, sendo uma opção 100% sustentável e econômica.
          </p>
        </div>
        <div class="p-8 rounded-2xl bg-gray-800 shadow-lg border border-gray-700">
          <h3 class="font-bold text-xl mb-3 text-green-400">Interatividade e Conexão</h3>
          <p class="text-gray-300">
            Com apenas um clique, seus clientes podem te ligar, enviar uma mensagem no WhatsApp ou visitar suas redes sociais.
          </p>
        </div>
        <div class="p-8 rounded-2xl bg-gray-800 shadow-lg border border-gray-700">
          <h3 class="font-bold text-xl mb-3 text-green-400">Plataforma de Vendas</h3>
          <p class="text-gray-300">
            Atue como um mini-site, onde você pode apresentar seus produtos, serviços e até mesmo vídeos, integrando com outras ferramentas.
          </p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default {
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      produtos: [],
      loading: true
    }
  },
  head() {
    return {
      title: 'Smart vCard - O Cartão que Impressiona',
      meta: [
        { hid: 'description', name: 'description', content: 'Adquira seu cartão digital e produtos NFC na Smart vCard.' }
      ]
    }
  },
  mounted() {
    this.carregarProdutos()
  },
  methods: {
    async carregarProdutos() {
      try {
        const response = await fetch(`${process.env.NUXT_ENV_API_URL || 'http://localhost:3001'}/produtos`)
        if (response.ok) {
          this.produtos = await response.json()
        }
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
      } finally {
        this.loading = false
      }
    },
    getImagemUrl(caminho) {
      if (!caminho) return ''
      if (caminho.startsWith('http')) return caminho
      const baseUrl = process.env.NUXT_ENV_API_URL || 'http://localhost:3001'
      return `${baseUrl}${caminho}`
    },
    formatPrice(value) {
      return Number(value).toFixed(2).replace('.', ',')
    },
    getWhatsappLink(productName) {
      const msg = `Olá! Gostaria de adquirir o produto: ${productName}. Como funciona?`
      return `https://api.whatsapp.com/send?phone=5583991185518&text=${encodeURIComponent(msg)}`
    }
  }
}
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>