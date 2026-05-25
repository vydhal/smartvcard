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
          Suporte ao Cliente
        </h1>
        <div class="text-gray-300 text-lg leading-relaxed">
          <p>Estamos aqui para ajudar! Se você tiver dúvidas, problemas ou precisar de assistência com o seu Cartão Digital, entre em contato conosco.</p><br/><p>Você pode enviar um email para suporte@simplisoft.com.br ou entrar em contato através das nossas redes sociais. Nosso horário de atendimento é de segunda a sexta, em horário comercial.</p>
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
    titleTemplate: 'Suporte ao Cliente - %s'
  }
}
</script>
