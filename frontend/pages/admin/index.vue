<template>
  <div class="min-h-screen bg-gray-100 p-8 font-sans">
    <div class="max-w-6xl mx-auto">
      
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Painel do Administrador</h1>
          <p class="text-gray-500">Gerencie chaves de acesso e cartões da plataforma</p>
        </div>
        <div class="flex space-x-4">
          <nuxt-link 
            to="/admin/produtos" 
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition flex items-center"
          >
            Gerenciar Produtos
          </nuxt-link>
          <button 
            @click="gerarChave" 
            :disabled="gerando"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition"
          >
            {{ gerando ? 'Gerando...' : '+ Nova Chave' }}
          </button>
          <button 
            @click="logout"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition"
          >
            Sair
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-200">
                <th class="p-4 text-sm font-semibold text-gray-600">ID</th>
                <th class="p-4 text-sm font-semibold text-gray-600">Chave de Acesso</th>
                <th class="p-4 text-sm font-semibold text-gray-600">Cliente / Usuário</th>
                <th class="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th class="p-4 text-sm font-semibold text-gray-600">Data de Geração</th>
                <th class="p-4 text-sm font-semibold text-gray-600 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" class="border-b border-gray-100">
                <td colspan="6" class="p-8 text-center text-gray-500">Carregando cartões...</td>
              </tr>
              <tr v-else-if="cartoes.length === 0" class="border-b border-gray-100">
                <td colspan="6" class="p-8 text-center text-gray-500">Nenhuma chave gerada ainda.</td>
              </tr>
              <tr 
                v-for="cartao in cartoes" 
                :key="cartao.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td class="p-4 text-sm text-gray-700">#{{ cartao.id }}</td>
                <td class="p-4 text-sm font-bold text-gray-900 bg-gray-100 rounded inline-block mt-2 ml-4 tracking-wider">{{ cartao.chave_acesso }}</td>
                <td class="p-4 text-sm text-gray-700">
                  <div v-if="cartao.usuario">
                    <p class="font-bold">{{ cartao.usuario.nome }}</p>
                    <p class="text-xs text-gray-500">{{ cartao.usuario.email }}</p>
                  </div>
                  <div v-else>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Aguardando cadastro
                    </span>
                  </div>
                </td>
                <td class="p-4 text-sm text-gray-700">
                  <span v-if="cartao.ativo" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ativo
                  </span>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Inativo
                  </span>
                </td>
                <td class="p-4 text-sm text-gray-500">
                  {{ new Date(cartao.criado_em).toLocaleDateString('pt-BR') }}
                </td>
                <td class="p-4 text-sm text-center">
                  <button class="text-blue-500 hover:text-blue-700 text-xs font-bold" @click="copiarChave(cartao.chave_acesso)">Copiar Chave</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  layout: 'blank',
  data() {
    return {
      cartoes: [],
      loading: true,
      gerando: false,
    }
  },
  mounted() {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      this.$router.push('/admin/login');
      return;
    }
    this.carregarCartoes();
  },
  methods: {
    async carregarCartoes() {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${process.env.NUXT_ENV_API_URL || 'http://localhost:3001'}/admin/cartoes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401 || response.status === 403) {
          this.logout();
          return;
        }
        const data = await response.json();
        this.cartoes = data;
      } catch (err) {
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    async gerarChave() {
      this.gerando = true;
      try {
        const token = localStorage.getItem('admin_token');
        const response = await fetch(`${process.env.NUXT_ENV_API_URL || 'http://localhost:3001'}/admin/gerar-chave`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Chave Gerada!',
            text: `A nova chave de acesso é: ${data.chave_acesso}`,
          });
          this.carregarCartoes();
        } else {
          throw new Error(data.error || 'Erro ao gerar chave');
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Erro', text: err.message });
      } finally {
        this.gerando = false;
      }
    },
    copiarChave(chave) {
      navigator.clipboard.writeText(chave);
      Swal.fire({
        icon: 'success',
        title: 'Copiada!',
        text: 'A chave foi copiada para a área de transferência.',
        timer: 1500,
        showConfirmButton: false
      });
    },
    logout() {
      localStorage.removeItem('admin_token');
      this.$router.push('/admin/login');
    }
  }
}
</script>
