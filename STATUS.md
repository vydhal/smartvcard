# 🌟 Smart vCard - Status do Projeto (SaaS)

Este documento registra o status atual, a arquitetura e os próximos passos do projeto Smart vCard, permitindo que qualquer outro desenvolvedor ou IA possa continuar o trabalho exatamente de onde parou.

## 🏗️ Arquitetura e Decisões Técnicas (Implementado)

### 1. Transição para SaaS e Banco de Dados (PostgreSQL + Prisma)
O projeto deixou de ser um gerador de HTML estático sem persistência e se tornou um SaaS real.
* **Modelo `Cartao`:** Adicionado o campo `dados_json` (tipo `Json`) no Prisma. Este campo é o coração do sistema, pois armazena configurações ricas (links de redes sociais, cores personalizadas, lista de produtos/serviços e banners) sem precisar criar dezenas de tabelas relacionais para cada detalhe do frontend.
* **Modelos `Empresa` e `Usuario`:** Separação clara de responsabilidades. A **Empresa (Administrador)** possui uma conta para gerenciar e vender os cartões. O **Usuário (Cliente final)** é dono do cartão digital em si.

### 2. Autenticação e Rotas Seguras (Node.js + Fastify)
Implementado **JWT (JSON Web Token)** com validação de tipo de acesso (RBAC - Role-Based Access Control):
* **Admin (Painel da Empresa):** Pode acessar `/admin/login` para entrar e `/admin/gerar-chave` para criar "Chaves de Acesso" de 8 dígitos alfanuméricos.
* **Usuário (Painel do Cliente):** Pode acessar `/cadastro` para resgatar uma chave comprada, vinculá-la a um e-mail e senha, e posteriormente fazer `/login`.
* O acesso de alteração dos dados do cartão é restrito via JWT: apenas o dono (Usuário vinculado) ou o criador (Empresa) podem alterar.

### 3. Frontend (Nuxt.js / Vue 2)
* **`pages/dashboard/_chave.vue`:** O antigo gerador aberto (`index.vue`) foi transformado no editor principal privado do cliente logado. Ao preencher os dados e customizar as cores/produtos, ele dispara um `PUT /cartoes/acesso/:chave` que salva toda a estrutura no `dados_json`.
* **`pages/c/_chave.vue`:** A **Vitrine Pública**. Uma rota pública que puxa o `dados_json` do backend usando a chave do cartão e renderiza o `<Preview>` em tela cheia para o mundo ver.
* **`pages/index.vue`:** Transformada em uma *Landing Page* comercial.

---

### 4. Marketplace Dinâmico e Uploads (Novidade!)
* **Banco de Dados:** Tabela `Produto` criada com foto nativa (`imagem_url`).
* **Backend Fastify:** Instalados `@fastify/multipart` e `@fastify/static` para receber uploads físicos direto na pasta `uploads/` do servidor, extinguindo a necessidade de links externos.
* **Painel Admin:** Nova tela `/admin/produtos` para adicionar produtos físicos (cartões PVC, Tags, Pulseiras) e gerenciar promoções.
* **Landing Page e Fluxo Comercial:** A `index.vue` virou uma vitrine incrível que puxa os produtos da API dinamicamente. Os botões de compra enviam o cliente direto para o WhatsApp comercial com a mensagem pronta de aquisição do produto.
* **Header Modernizado:** Antigo layout substituído por navbar responsiva com logo, navegação via âncoras e botões limpos de login/cadastro.

---

## 🎯 Próximos Passos (Roadmap)

### Fase 1: Finalização Comercial (✅ CONCLUÍDO)
- [x] **Landing Page:** Vitrine desenhada e conectada com a API.
- [x] **Integração de E-commerce:** Fluxo de venda direto via WhatsApp (Checkout Conversacional) estabelecido.
- [x] **Catálogo Híbrido (Estilo Taggy):** Sistema de gestão dinâmico criado e funcionando perfeitamente no painel Admin.

### Fase 2: Refinamento de UX/UI
- [ ] Otimizar o editor (`dashboard/_chave.vue`) para que a experiência mobile seja fluida, rápida e similar a um aplicativo nativo.
- [ ] Adicionar microinterações, skeletons de loading e um design mais "premium" com Tailwind CSS nas views do cliente.

---
**Nota para a IA:** O backend está rodando no Docker (`docker-compose`). Caso necessite de alterações no banco de dados, o container `backend` já está configurado com `node:20` para evitar conflitos de OpenSSL com o Prisma. Após atualizar o Prisma, utilize `npx prisma db push` (em Windows use `;` para encadear comandos, não `&&`).
