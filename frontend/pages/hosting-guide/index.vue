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
          Guia de Hospedagem
        </h1>
        <div class="text-gray-300 text-lg leading-relaxed">
          <p>Você pode hospedar o seu Cartão Digital diretamente com a Simplisoft ou baixar os arquivos gerados (HTML/CSS) para hospedar no seu próprio domínio e servidor.</p><br/><p>Para hospedar no seu próprio servidor, basta descompactar os arquivos baixados e enviá-los via FTP para o seu diretório web público (public_html, www, etc).</p>
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
    titleTemplate: 'Guia de Hospedagem - %s'
  }
}
</script>
