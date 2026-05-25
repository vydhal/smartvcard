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
          Política de Cookies
        </h1>
        <div class="text-gray-300 text-lg leading-relaxed">
          <p>Como é prática comum em quase todos os sites profissionais, este site usa cookies, que são pequenos arquivos baixados no seu computador, para melhorar sua experiência. Esta página descreve quais informações eles coletam, como as usamos e por que às vezes precisamos armazenar esses cookies.</p><br/><p>Nós utilizamos cookies para diversos fins, como permitir o funcionamento de certas áreas da plataforma, lembrar as suas preferências de usuário, etc. Você pode desativar o uso de cookies no seu navegador, porém isso pode afetar a funcionalidade deste e de muitos outros sites que você visita.</p>
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
    titleTemplate: 'Política de Cookies - %s'
  }
}
</script>
