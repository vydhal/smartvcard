<template>
  <div class="container relative bg-gray-900 mx-auto text-gray-100" style="max-width: 960px">
    <Header />

    <a href="https://api.whatsapp.com/send?phone=SEU_NUMERO_AQUI" class="fixed bottom-8 right-8 z-50 p-4 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200" target="_blank" rel="noopener noreferrer" aria-label="Fale conosco pelo WhatsApp">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-phone-call">
        <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-10 10l-6.2-6.2a1 1 0 0 0-1.4 0l-1.6 1.6a1 1 0 0 0 0 1.4l6.2 6.2a1 1 0 0 0 1.4 0l1.6-1.6a1 1 0 0 0 0-1.4z"></path>
      </svg>
    </a>

    <div class="px-4 py-32 text-center md:py-48">
      <h1 class="text-4xl md:text-6xl font-extrabold leading-tight">
        O seu cartão de visita digital que impressiona
      </h1>
      <p class="mt-8 text-xl md:text-2xl w-full md:w-3/4 mx-auto text-gray-200">
        Transforme a maneira como você se apresenta. Crie um cartão de visita interativo, moderno e que funciona como seu mini-site pessoal.
      </p>
      <div class="mt-8">
        <nuxt-link to="/test-drive" class="font-extrabold leading-none text-lg tracking-wide select-none p-5 text-white bg-green-500 rounded hover:bg-green-600 focus:bg-green-600 transition-colors duration-200 focus:outline-none">
          Crie seu cartão agora!
        </nuxt-link>
      </div>
    </div>

    <div class="px-4 py-24 bg-gray-800">
      <h2 class="font-extrabold text-3xl text-center mb-12">
        Benefícios de ter um Cartão Digital
      </h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="p-6 rounded bg-gray-700">
          <h3 class="font-bold text-xl mb-2">Economia e Sustentabilidade</h3>
          <p class="text-gray-300">
            Diga adeus ao papel. Nosso cartão digital elimina o custo e o desperdício, sendo uma opção 100% sustentável e econômica.
          </p>
        </div>
        <div class="p-6 rounded bg-gray-700">
          <h3 class="font-bold text-xl mb-2">Interatividade e Conexão</h3>
          <p class="text-gray-300">
            Com apenas um clique, seus clientes podem te ligar, enviar uma mensagem no WhatsApp ou visitar suas redes sociais.
          </p>
        </div>
        <div class="p-6 rounded bg-gray-700">
          <h3 class="font-bold text-xl mb-2">Plataforma de Vendas</h3>
          <p class="text-gray-300">
            Atue como um mini-site, onde você pode apresentar seus produtos, serviços e até mesmo vídeos, integrando com outras ferramentas.
          </p>
        </div>
      </div>
    </div>

    <div class="px-4 py-24">
      <h2 class="font-extrabold text-3xl text-center mb-12">
        O que nossos clientes dizem
      </h2>
      <div class="grid md:grid-cols-2 gap-8">
        <div class="p-6 rounded bg-gray-800">
          <p class="text-gray-300 italic">"O SMART vCARD mudou a forma como eu faço networking. É prático, moderno e muito profissional!"</p>
          <p class="mt-4 font-bold text-green-500">- Maria Silva, Empresária</p>
        </div>
        <div class="p-6 rounded bg-gray-800">
          <p class="text-gray-300 italic">"Consegui mais leads e fechei mais negócios depois que comecei a usar o cartão digital. A equipe de suporte é fantástica!"</p>
          <p class="mt-4 font-bold text-green-500">- João Santos, Consultor de Marketing</p>
        </div>
      </div>
    </div>

    <div class="px-4 py-24 bg-green-600 text-center">
      <h2 class="font-extrabold text-3xl md:text-4xl">
        Pronto para criar seu cartão digital?
      </h2>
      <p class="mt-4 text-xl text-gray-100">
        Clique abaixo e inicie o processo com nossa equipe de suporte.
      </p>
      <div class="mt-8">
        <nuxt-link to="/" class="font-extrabold leading-none text-lg tracking-wide select-none p-5 text-green-600 bg-gray-100 rounded hover:bg-gray-200 focus:bg-gray-200 transition-colors duration-200 focus:outline-none">
          Comece agora
        </nuxt-link>
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
  // Onde você pode definir o título da página
  head() {
    return {
      title: 'Vendas - Cartão Digital',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Crie um cartão de visita digital interativo para alavancar seu negócio.'
        }
      ]
    }
  },
}
</script>

<style lang="scss" scoped>
// Estilos personalizados se necessário, mas os estilos do Tailwind já são usados no template.
</style>