<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <div>
        <nuxt-link to="/admin" class="text-blue-500 hover:underline mb-2 inline-block">&larr; Voltar ao Painel</nuxt-link>
        <h1 class="text-2xl font-bold text-gray-800">Gerenciar Produtos</h1>
      </div>
      <button @click="abrirModal" class="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
        + Novo Produto
      </button>
    </div>

    <!-- Tabela de Produtos -->
    <div class="bg-white rounded shadow overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th class="py-3 px-6">Imagem</th>
            <th class="py-3 px-6">Nome</th>
            <th class="py-3 px-6">Preço</th>
            <th class="py-3 px-6">Status</th>
            <th class="py-3 px-6 text-center">Ações</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-for="produto in produtos" :key="produto.id" class="border-b border-gray-200 hover:bg-gray-100">
            <td class="py-3 px-6">
              <img :src="getImagemUrl(produto.imagem_url)" alt="Produto" class="w-12 h-12 rounded object-cover" />
            </td>
            <td class="py-3 px-6 font-semibold">{{ produto.nome }}</td>
            <td class="py-3 px-6">
              <span v-if="produto.preco_promocional" class="text-red-500 line-through text-xs mr-2">R$ {{ produto.preco }}</span>
              <span class="font-bold text-green-600">R$ {{ produto.preco_promocional || produto.preco }}</span>
            </td>
            <td class="py-3 px-6">
              <span class="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">Ativo</span>
            </td>
            <td class="py-3 px-6 text-center">
              <button @click="deletarProduto(produto.id)" class="text-red-500 hover:text-red-700">
                Remover
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Novo Produto -->
    <div v-if="modalAberto" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Adicionar Produto</h2>
        <form @submit.prevent="salvarProduto">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Nome</label>
            <input v-model="form.nome" type="text" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Descrição</label>
            <textarea v-model="form.descricao" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2">Preço Normal (R$)</label>
              <input v-model="form.preco" type="number" step="0.01" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2">Preço Promocional</label>
              <input v-model="form.preco_promocional" type="number" step="0.01" class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2">Imagem do Produto</label>
            <input type="file" @change="onFileChange" accept="image/*" required class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" @click="modalAberto = false" class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancelar</button>
            <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" :disabled="loading">
              {{ loading ? 'Salvando...' : 'Salvar Produto' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  layout: 'blank',
  data() {
    return {
      produtos: [],
      modalAberto: false,
      loading: false,
      form: {
        nome: '',
        descricao: '',
        preco: '',
        preco_promocional: '',
        imagem: null
      }
    }
  },
  mounted() {
    this.carregarProdutos()
  },
  methods: {
    getImagemUrl(caminho) {
      const baseUrl = process.env.NUXT_ENV_API_URL || 'http://localhost:3001'
      return `${baseUrl}${caminho}`
    },
    abrirModal() {
      this.form = { nome: '', descricao: '', preco: '', preco_promocional: '', imagem: null }
      this.modalAberto = true
    },
    onFileChange(e) {
      this.form.imagem = e.target.files[0]
    },
    async carregarProdutos() {
      try {
        const response = await fetch(`${process.env.NUXT_ENV_API_URL || 'http://localhost:3001'}/produtos`)
        if (response.ok) {
          this.produtos = await response.json()
        }
      } catch (err) {
        console.error(err)
      }
    },
    async salvarProduto() {
      this.loading = true
      const token = localStorage.getItem('admin_token')
      
      const formData = new FormData()
      formData.append('nome', this.form.nome)
      formData.append('descricao', this.form.descricao)
      formData.append('preco', this.form.preco)
      if (this.form.preco_promocional) {
        formData.append('preco_promocional', this.form.preco_promocional)
      }
      formData.append('file', this.form.imagem)

      try {
        const response = await fetch(`${process.env.NUXT_ENV_API_URL || 'http://localhost:3001'}/admin/produtos`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        if (response.ok) {
          Swal.fire({ icon: 'success', title: 'Sucesso', text: 'Produto cadastrado!', timer: 2000 })
          this.modalAberto = false
          this.carregarProdutos()
        } else {
          const err = await response.json()
          Swal.fire({ icon: 'error', title: 'Erro', text: err.error || 'Erro ao cadastrar' })
        }
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Erro', text: 'Falha na conexão' })
      } finally {
        this.loading = false
      }
    },
    async deletarProduto(id) {
      const confirm = await Swal.fire({
        title: 'Tem certeza?',
        text: 'O produto não será mais exibido na loja.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir'
      })

      if (confirm.isConfirmed) {
        const token = localStorage.getItem('admin_token')
        try {
          const response = await fetch(`${process.env.NUXT_ENV_API_URL || 'http://localhost:3001'}/admin/produtos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (response.ok) {
            this.carregarProdutos()
            Swal.fire({ icon: 'success', title: 'Excluído', timer: 1500, showConfirmButton: false })
          }
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Erro' })
        }
      }
    }
  }
}
</script>
