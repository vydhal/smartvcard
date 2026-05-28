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

    <div v-else class="relative w-full max-w-md mx-auto shadow-2xl min-h-screen flex flex-col">
      <Preview
        :username="genInfo.fname"
        :genInfo="genInfo"
        :images="images"
        :featured="featured"
        :colors="colors"
        :primaryActions="primaryActions"
        :secondaryActions="secondaryActions"
        :PreviewMode="true"
        :sectionOrder="sectionOrder"
        :footerCredit="true"
        :hasLightBG="hasLightBG"
      />

      <!-- Barra de ações flutuante -->
      <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-3">
        <button
          @click="baixarContato"
          class="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-5 rounded-full shadow-lg transition-colors duration-200 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Salvar Contato
        </button>

        <button
          @click="mostrarQR = !mostrarQR"
          class="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-5 rounded-full shadow-lg transition-colors duration-200 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          QR Code
        </button>
      </div>

      <!-- Modal QR Code -->
      <div
        v-if="mostrarQR"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
        @click.self="mostrarQR = false"
      >
        <div class="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl max-w-xs w-full mx-4">
          <h3 class="text-gray-800 font-bold text-lg mb-4">Compartilhar cartão</h3>
          <canvas ref="qrCanvas" class="rounded-lg"></canvas>
          <p class="text-gray-500 text-xs mt-4 text-center break-all">{{ cardURL }}</p>
          <button
            @click="mostrarQR = false"
            class="mt-5 text-gray-500 hover:text-gray-700 text-sm underline"
          >Fechar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Preview from '~/components/Preview.vue'
import { api } from '~/utils/api.js'

export default {
  components: { Preview },
  layout: 'blank',
  head() {
    const nome = [this.genInfo.fname, this.genInfo.lname].filter(Boolean).join(' ') || 'Cartão Digital'
    const titulo = this.genInfo.title ? nome + ' · ' + this.genInfo.title : nome
    const descricao = this.genInfo.bio || (this.genInfo.biz ? 'Cartão digital de ' + nome + ' — ' + this.genInfo.biz : 'Veja o cartão digital de ' + nome)
    const foto = this.images?.photo?.url || ''
    const url = typeof window !== 'undefined' ? window.location.href : ''
    return {
      title: titulo,
      meta: [
        { hid: 'description', name: 'description', content: descricao },
        { hid: 'og:title', property: 'og:title', content: titulo },
        { hid: 'og:description', property: 'og:description', content: descricao },
        { hid: 'og:type', property: 'og:type', content: 'profile' },
        { hid: 'og:url', property: 'og:url', content: url },
        ...(foto ? [{ hid: 'og:image', property: 'og:image', content: foto }] : []),
        { hid: 'twitter:card', name: 'twitter:card', content: foto ? 'summary_large_image' : 'summary' },
        { hid: 'twitter:title', name: 'twitter:title', content: titulo },
        { hid: 'twitter:description', name: 'twitter:description', content: descricao },
        ...(foto ? [{ hid: 'twitter:image', name: 'twitter:image', content: foto }] : [])
      ]
    }
  },
  data() {
    return {
      loading: true,
      erro: false,
      mostrarQR: false,
      genInfo: {
        name: '', fname: '', lname: '', pronouns: '',
        title: '', biz: '', street: '', city: '',
        state: '', postal: '', country: '', bio: '', key: ''
      },
      colors: {
        logoBg: { color: '#1F2937', openPalette: false },
        mainBg: { color: '#F9FAFB', openPalette: false },
        buttonBg: { color: '#374151', openPalette: false },
        cardBg: { color: '#E5E7EB', openPalette: false }
      },
      images: {
        photo: { url: null },
        cover: { url: null },
        logo: { url: null }
      },
      featured: [],
      primaryActions: [],
      secondaryActions: [],
      sectionOrder: ['primary', 'secondary', 'featured']
    }
  },
  computed: {
    cardURL() {
      if (typeof window === 'undefined') return ''
      return window.location.href
    }
  },
  watch: {
    mostrarQR(val) {
      if (val) this.$nextTick(() => this.gerarQR())
    }
  },
  async mounted() {
    this.carregarCartao()
  },
  methods: {
    hasLightBG(e) {
      if (!this.colors[e] || !this.colors[e].color) return false
      let hex = this.colors[e].color.slice(1)
      if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2]
      const r = parseInt(hex.slice(0, 2), 16)
      const g = parseInt(hex.slice(2, 4), 16)
      const b = parseInt(hex.slice(4, 6), 16)
      return Math.round((r * 299 + g * 587 + b * 114) / 1000) > 125
    },

    async carregarCartao() {
      const chave = this.$route.params.chave
      if (!chave) { this.erro = true; this.loading = false; return }
      try {
        const res = await fetch((process.env.NUXT_ENV_API_URL || 'http://localhost:3001') + '/cartoes/acesso/' + chave)
        if (res.ok) {
          const data = await res.json()
          if (data.dados_json) {
            const s = data.dados_json
            this.genInfo = s.genInfo || this.genInfo
            this.colors = s.colors || this.colors
            this.images = s.images || this.images
            this.featured = s.featured || this.featured
            this.primaryActions = s.primaryActions || this.primaryActions
            this.secondaryActions = s.secondaryActions || this.secondaryActions
            this.sectionOrder = s.sectionOrder || ['primary', 'secondary', 'featured']
          }
          this.genInfo.fname = data.nome_perfil || this.genInfo.fname
          this.genInfo.title = data.cargo || this.genInfo.title
          this.genInfo.biz = data.empresa_atual || this.genInfo.biz
          api.registrarVisualizacao(chave).catch(() => {})
        } else {
          this.erro = true
        }
      } catch { this.erro = true }
      finally { this.loading = false }
    },

    gerarQR() {
      const canvas = this.$refs.qrCanvas
      if (!canvas || typeof QRCode === 'undefined') return
      QRCode.toCanvas(canvas, this.cardURL, { width: 220, margin: 2, color: { dark: '#111827', light: '#ffffff' } })
    },

    baixarContato() {
      const g = this.genInfo
      const tel = g.phone || g.tel || ''
      const wa = g.whatsapp || ''
      const email = g.email || g.email_address || ''
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'FN:' + (g.fname || '') + ' ' + (g.lname || ''),
        'N:' + (g.lname || '') + ';' + (g.fname || '') + ';;;',
        g.title ? 'TITLE:' + g.title : '',
        g.biz ? 'ORG:' + g.biz : '',
        tel ? 'TEL;TYPE=CELL:' + tel : '',
        wa ? 'TEL;TYPE=WORK:' + wa : '',
        email ? 'EMAIL:' + email : '',
        g.bio ? 'NOTE:' + g.bio : '',
        'URL:' + this.cardURL,
        'END:VCARD'
      ].filter(Boolean).join('\r\n')

      const blob = new Blob([lines], { type: 'text/vcard;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = ((g.fname || 'contato') + '-' + (g.lname || '')).trim() + '.vcf'
      a.click()
      URL.revokeObjectURL(url)
    }
  }
}
</script>

<style scoped>
body { margin: 0; }
</style>
