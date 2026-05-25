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
          Política de Uso Aceitável
        </h1>
        <div class="text-gray-300 text-lg leading-relaxed">
          <p>Esta Política de Uso Aceitável descreve as diretrizes para o uso dos serviços da Simplisoft. É estritamente proibido utilizar nossa plataforma para propagar conteúdo ilegal, ofensivo, difamatório ou que viole direitos autorais.</p><br/><p>Reservamo-nos o direito de suspender ou encerrar qualquer conta ou cartão digital que for flagrado violando estas diretrizes, sem aviso prévio.</p>
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
    titleTemplate: 'Política de Uso Aceitável - %s'
  }
}
</script>
