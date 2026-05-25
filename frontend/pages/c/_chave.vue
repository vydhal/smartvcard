<template>
  <div class="bg-gray-900 min-h-screen">
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <span class="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full"></span>
    </div>
    
    <div v-else-if="erro" class="flex justify-center items-center h-screen">
      <div class="bg-gray-800 p-8 rounded-xl text-center text-white">
        <h2 class="text-2xl font-bold mb-2">Cartão não encontrado</h2>
        <p class="text-gray-400">Verifique se o link está correto.</p>
      </div>
    </div>
    
    <div v-else class="h-screen relative w-full max-w-md mx-auto shadow-2xl">
      <Preview 
        :username="genInfo.fname" 
        :genInfo="genInfo" 
        :images="images" 
        :featured="featured" 
        :colors="colors" 
        :primaryActions="primaryActions" 
        :secondaryActions="secondaryActions" 
        :PreviewMode="false" 
        :footerCredit="true" 
        :hasLightBG="hasLightBG" 
      />
    </div>
  </div>
</template>

<script>
import Preview from '~/components/Preview.vue'

export default {
  components: {
    Preview
  },
  layout: 'blank', // Use um layout em branco para ocupar a tela toda
  data() {
    return {
      loading: true,
      erro: false,
      genInfo: {
        name: '',
        fname: '',
        lname: '',
        pronouns: '',
        title: '',
        biz: '',
        street: '',
        city: '',
        state: '',
        postal: '',
        country: '',
        bio: '',
        key: ''
      },
      colors: {
        primary: '#1D4ED8',
        secondary: '#D1D5DB',
        accent: '#2563EB',
        background: '#FFFFFF',
        text: '#111827'
      },
      images: {
        photo: { url: null },
        cover: { url: null },
        logo: { url: null }
      },
      featured: [],
      primaryActions: [],
      secondaryActions: []
    }
  },
  async mounted() {
    this.carregarCartao()
  },
  methods: {
    hasLightBG(e) {
      if (!this.colors[e] || !this.colors[e].color) return false;
      let hex = this.colors[e].color
      hex = hex.slice(1)
      if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
      }
      let r = parseInt(hex.slice(0, 2), 16)
      let g = parseInt(hex.slice(2, 4), 16)
      let b = parseInt(hex.slice(4, 6), 16)
      const brightness = Math.round(
        (parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000
      )
      return brightness > 125
    },
    async carregarCartao() {
      const chave = this.$route.params.chave
      if (!chave) {
        this.erro = true
        this.loading = false
        return
      }

      try {
        const response = await fetch(`${process.env.NUXT_ENV_API_URL || 'http://localhost:3001'}/cartoes/acesso/${chave}`)
        if (response.ok) {
          const data = await response.json()
          
          if (data.dados_json) {
            const state = data.dados_json
            this.genInfo = state.genInfo || this.genInfo
            this.colors = state.colors || this.colors
            this.images = state.images || this.images
            this.featured = state.featured || this.featured
            this.primaryActions = state.primaryActions || this.primaryActions
            this.secondaryActions = state.secondaryActions || this.secondaryActions
          }
          
          this.genInfo.fname = data.nome_perfil || this.genInfo.fname
          this.genInfo.title = data.cargo || this.genInfo.title
          this.genInfo.biz = data.empresa_atual || this.genInfo.biz
          
        } else {
          this.erro = true
        }
      } catch (err) {
        this.erro = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Ensure it looks like a mobile app */
body {
  margin: 0;
  overflow: hidden;
}
</style>
