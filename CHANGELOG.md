# Changelog — Smart vCard

## [0.2.0] — 2026-05-25 — Melhorias e Features Completas

### Resumo
Segunda sessão de desenvolvimento. Adicionadas todas as features essenciais ao produto: persistência de imagens, auto-save, analytics, QR code, download de contato (.vcf), SEO meta tags, painel admin completo, página de erro 404 e fluxo de cadastro com chave pré-preenchida. Corrigido erro de sintaxe crítico no editor de cartão.

---

### Backend

#### Upload de imagens (`POST /cartoes/acesso/:chave/upload`)
- Endpoint multipart que recebe `tipo` (photo/cover/logo) e salva em `/uploads/`
- Retorna `{ url: '/uploads/filename' }`
- Protegido por JWT; valida que o usuário é dono do cartão

#### Analytics — modelo Visualizacao
- Adicionado modelo `Visualizacao` ao `backend/prisma/schema.prisma` com `cartao_id`, `pais?`, `criado_em`
- `POST /cartoes/acesso/:chave/view` — registra visualização (público, sem auth)
- `GET /usuarios/meus-analytics` — retorna total de views e views dos últimos 7 dias por cartão (JWT)
- **ATENÇÃO**: requer `npx prisma db push` para criar a tabela `visualizacoes` no banco

#### Admin — endpoints adicionados
- `PATCH /admin/cartoes/:id/toggle` — ativa/desativa uma chave de acesso
- `PUT /admin/produtos/:id` — atualiza produto (campos + imagem opcional + toggle ativo)

#### Docker — volume de uploads
- `docker-compose.yml`: adicionado volume nomeado `uploads_data` montado em `/app/uploads`
- Imagens sobrevivem a rebuilds do container

---

### Frontend

#### Editor de cartão (`pages/dashboard/_chave.vue`)
- Auto-save: watchers em `genInfo`, `colors`, `primaryActions`, `secondaryActions` — debounce de 3s, indicador visual no header
- Upload de imagens: ao salvar, imagens base64 são enviadas para `/cartoes/acesso/:chave/upload` e URL do servidor é armazenada no lugar
- Método `_dataURLtoBlob()` para converter imagens do editor antes do upload
- `salvarCartao(silent = false)` — parâmetro `silent` pula o Swal.fire (usado pelo auto-save)
- **Bug corrigido**: bloco `watch:` estava fechando prematuramente na linha 2659 (`  },`), deixando `metaData`, `seoOptimization` e os novos watchers fora do `watch:`. Corrigido removendo o fechamento prematuro e adicionando vírgula em `deep: true`

#### Visualização pública (`pages/c/_chave.vue`) — reescrita
- SEO: `head()` com og:title, og:description, og:image, og:url, twitter:card
- Botão flutuante "Salvar Contato": gera e faz download de arquivo `.vcf` (vCard 3.0)
- Botão "QR Code": abre modal com QR code gerado por `QRCode.toCanvas()`
- Registra visualização via `api.registrarVisualizacao(chave)` após carregar cartão

#### Dashboard (`pages/dashboard/index.vue`)
- Exibe total de visitas e visitas dos últimos 7 dias por cartão (via `/usuarios/meus-analytics`)

#### Admin (`pages/admin/index.vue`) — reescrito
- Cards de resumo: total de chaves, ativadas, aguardando cadastro
- Filtros: todos / pendentes / ativos
- Toggle ativo/inativo de chaves via `PATCH /admin/cartoes/:id/toggle`
- Botão "Link cadastro": copia `origin/cadastro?chave=XXXX` para a área de transferência

#### Admin produtos (`pages/admin/produtos.vue`)
- Botão de editar produto abre modal pré-preenchido
- Toggle ativo/inativo via `PUT /admin/produtos/:id`
- Exibe miniatura da imagem atual ao editar

#### Cadastro (`pages/cadastro.vue`)
- `mounted()`: pré-preenche `chave_acesso` via `?chave=` na query string
- Pós-cadastro: redireciona para `/dashboard/:chave` em vez de `/dashboard`

#### Página de erro 404 (`layouts/error.vue`)
- Design dark com branding Simplisoft
- Mostra mensagem de 404 ou erro genérico
- Botões "Voltar ao início" e "Meu painel"

#### API client (`utils/api.js`)
- Adicionadas: `uploadImage(chave, tipo, blob)`, `meusAnalytics()`, `registrarVisualizacao(chave)`

---

### Infraestrutura

#### docker-compose.dev.yml (criado — opcional)
- Bind mounts para hot-reload em dev (requer filesystem WSL2)
- `CHOKIDAR_USEPOLLING=true` para file watching dentro do container
- Volume separado `uploads_dev`

---

## [0.1.0] — 2026-05-25 — MVP Funcional

### Resumo
Primeira sessão de estabilização do projeto. O objetivo foi tornar o sistema completamente funcional do zero, corrigindo erros críticos em todas as camadas: autenticação, infraestrutura Docker, roteamento frontend e visualização pública de cartões.

---

### Backend

#### Autenticação com bcrypt
- Adicionado `bcryptjs` e `@types/bcryptjs` ao `backend/package.json`
- Senhas de usuários (`/usuarios/register`, `/usuarios/login`) agora são hasheadas corretamente
- Senhas de empresas/admin (`/empresas`, `/empresas/login`) idem
- **Causa raiz**: senhas estavam sendo salvas em texto puro; o `bcrypt.compare` comparava hash com hash e nunca batia

#### Seed do banco
- Reescrito `backend/prisma/seed.js` para usar `prisma.empresa.upsert` com senha hasheada
- Adicionada seção `"prisma": { "seed": "node prisma/seed.js" }` ao `package.json` (obrigatória para `npx prisma db seed`)
- Admin padrão: `admin@simplisoft.com.br` / `admin123`

---

### Frontend

#### Layout `blank` ausente
- Criado `frontend/layouts/blank.vue`
- Páginas `login.vue`, `admin/login.vue`, `cadastro.vue` e `c/_chave.vue` declaravam `layout: 'blank'` mas o arquivo não existia, causando falha silenciosa

#### Cliente de API centralizado (`utils/api.js`)
- Arquivo estava vazio; reescrito com cliente HTTP completo
- Funções: `register`, `login`, `meusCartoes`, `adminLogin`, `criarEmpresa`, `getCartao`, `updateCartao`, `gerarChave`, `listarCartoes`, `getProdutos`
- Stubs de retrocompatibilidade: `createAvatar`, `checkLicense`, `saveToGoogleSheet`, `payToDownloadZip`, `redeemTheCode`

#### Editor de cartão (`pages/dashboard/_chave.vue`)
- Removida seção hero/marketing que aparecia no lugar do editor
- `mounted()` agora verifica token JWT e redireciona para `/login` se ausente
- `currentStep = 1` definido no `mounted()` para iniciar o editor imediatamente
- Adicionada barra de cabeçalho com: botão "← Meus Cartões", link "Ver cartão online", botão "Salvar", botão "Sair"
- URL do cartão corrigida de `'yoursite/vcard/' + username` para `window.location.origin + /c/:chave`
- Adicionado método `logout()` que limpa `user_token` e redireciona
- Removida inicialização MSAL (Microsoft) desnecessária

#### Visualização pública (`pages/c/_chave.vue`)
- **Causa raiz do erro "Página Não Encontrada"**: `colors` inicializado com chaves erradas (`primary`, `secondary`, `accent`...) enquanto `Preview.vue` usa template interpolation `{{colors.buttonBg.color}}` — o acesso a `.color` em `undefined` causava TypeError e derrubava o componente
- Corrigido para o formato correto: `{ logoBg, mainBg, buttonBg, cardBg }` cada um como `{ color, openPalette }`

#### Dashboard (`pages/dashboard/index.vue`)
- Link "Ver Cartão Online" corrigido de `/?id=${chave}` para `/c/${chave}`

#### Footer (`components/Footer.vue`)
- Removidos links de OSS (GitHub, AGPLv3, Início, Guia de Hospedagem, Treinamento)
- Atualizado copyright 2024 → 2025
- Mantidos: Política de Privacidade, Termos de Serviço, Política de Cookies, Suporte

#### Nuxt config
- Removido script tag do Stripe (`https://js.stripe.com/v3`) que causava erro `net::ERR_NAME_NOT_RESOLVED` em toda página

---

### Infraestrutura (Docker)

#### Variável de ambiente da API
- Corrigido `docker-compose.yml`: `API_URL` → `NUXT_ENV_API_URL`
- Nuxt 2 exige o prefixo `NUXT_ENV_` para expor variáveis ao lado cliente

#### Bind mounts removidos
- **Causa raiz**: bug do Docker Desktop + WSL2 no Windows — `mkdir /run/desktop/mnt/host/d: file exists`
- Removidos todos os `volumes` de bind mount do backend e frontend
- Criados `backend/.dockerignore` e `frontend/.dockerignore` para evitar que `.env` local seja copiado para a imagem
- **Consequência**: qualquer mudança de código requer `docker-compose up --build`

#### Healthcheck do PostgreSQL
- Adicionado `healthcheck` ao serviço `db` com `pg_isready`
- Backend agora usa `depends_on: db: condition: service_healthy`

---

### Credenciais padrão

| Acesso | URL | Email | Senha |
|--------|-----|-------|-------|
| Admin | `/admin/login` | `admin@simplisoft.com.br` | `admin123` |
| Usuário | `/login` | (cadastro via `/cadastro`) | — |

---

### Como rodar

```bash
# 1. Subir os containers (primeira vez ou após mudança de código)
docker-compose up --build -d

# 2. Aguardar o frontend compilar (~30s) e verificar:
docker-compose logs --tail=10 frontend

# 3. Rodar seed (apenas primeira vez ou para resetar o admin)
docker exec smartvcard-backend npx prisma db push
docker exec smartvcard-backend npx prisma db seed

# 4. Acessar
# Frontend: http://localhost:3005
# Backend:  http://localhost:3001
# DB:       localhost:5433
```
