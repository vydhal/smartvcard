<template>
  <div class="container relative bg-gray-900 mx-auto text-gray-100" style="max-width: 960px">
    <div class="px-4">
      <div class="flex items-start justify-between pt-8">
        <NuxtLink to="/">
          <div class="logo w-24" style="width: 8rem !important; margin-top: -25px" v-html="require(`~/assets/icons/logo.svg?include`)" title="Simplisoft"></div>
        </NuxtLink>
        <Header />
      </div>
      <div class="max-w-screen-sm min-h-screen">
        <h1 class="text-3xl md:text-5xl font-extrabold mt-24 md:leading-tight mb-8">
          Treinamento e Tutoriais
        </h1>
        <div class="text-gray-300 text-lg leading-relaxed">
          <p>Aprenda a tirar o máximo proveito do seu Cartão Digital Vitualll! Nesta seção você encontrará dicas de como configurar seu perfil, escolher os melhores links e compartilhar seu QR Code de forma eficiente.</p><br/><p>Em breve disponibilizaremos vídeos e tutoriais passo a passo. Fique ligado!</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default {
  components: { Header, Footer },
  head: {
    titleTemplate: 'Treinamento e Tutoriais - %s'
  }
}
</script>
