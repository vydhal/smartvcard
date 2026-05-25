const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/pages/dashboard/_chave.vue');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Inject loadCardData() into methods
const loadCardDataMethod = `
    async loadCardData() {
      const chave = this.$route.params.chave;
      if (!chave) return;
      const token = localStorage.getItem('user_token');
      try {
        const response = await fetch(\`\${process.env.NUXT_ENV_API_URL || 'http://localhost:3001'}/cartoes/acesso/\${chave}\`, {
          headers: { 'Authorization': \`Bearer \${token}\` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.dados_json) {
            const state = data.dados_json;
            this.genInfo = state.genInfo || this.genInfo;
            this.colors = state.colors || this.colors;
            this.images = state.images || this.images;
            this.featured = state.featured || this.featured;
            this.primaryActions = state.primaryActions || this.primaryActions;
            this.secondaryActions = state.secondaryActions || this.secondaryActions;
          }
          // Fallback from db standard fields
          this.genInfo.fname = data.nome_perfil || this.genInfo.fname;
          this.genInfo.title = data.cargo || this.genInfo.title;
          this.genInfo.biz = data.empresa_atual || this.genInfo.biz;
          
          this.cartaoOriginal = data; // Keep a reference
        }
      } catch (e) {
        console.error(e);
      }
    },
    async salvarCartao() {
      const chave = this.$route.params.chave;
      const token = localStorage.getItem('user_token');
      
      const payload = {
        nome_perfil: this.genInfo.fname || this.genInfo.name,
        cargo: this.genInfo.title,
        empresa_atual: this.genInfo.biz,
        dados_json: {
          genInfo: this.genInfo,
          colors: this.colors,
          images: this.images,
          featured: this.featured,
          primaryActions: this.primaryActions,
          secondaryActions: this.secondaryActions
        }
      };

      try {
        const response = await fetch(\`\${process.env.NUXT_ENV_API_URL || 'http://localhost:3001'}/cartoes/acesso/\${chave}\`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': \`Bearer \${token}\`
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Salvo!',
            text: 'Cartão atualizado com sucesso!',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          const err = await response.json();
          Swal.fire({ icon: 'error', title: 'Erro', text: err.error || 'Erro ao salvar' });
        }
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Erro', text: 'Falha na conexão com o servidor' });
      }
    },
`;

content = content.replace('methods: {', 'methods: {\n' + loadCardDataMethod);

// 2. Add loadCardData() to mounted
const mountedHook = `async mounted() {
    this.loadCardData();
`;
content = content.replace('async mounted() {', mountedHook);

// 3. Replace Generate button with Save button
content = content.replace(
  'Gerar Cartão Digital e Baixar',
  'Salvar Meu Cartão'
);
content = content.replace(
  '@click="openModal()"',
  '@click="salvarCartao()"'
);

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated _chave.vue');
