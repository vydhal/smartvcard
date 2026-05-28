import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import path from 'path'
import fs from 'fs'
import { pipeline } from 'stream/promises'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

async function enviarEmail(to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST
  if (!host) {
    console.log('[EMAIL] SMTP não configurado. Destino:', to, '| Assunto:', subject)
    return
  }
  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  })
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to, subject, html
  })
}
const fastify: FastifyInstance = Fastify({ logger: true })

fastify.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecret123'
})

fastify.register(multipart)

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'uploads'),
  prefix: '/uploads/',
})

const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Registra visualização do cartão público
fastify.post('/cartoes/acesso/:chave/view', async (request, reply) => {
  const { chave } = request.params as { chave: string }
  const cartao = await prisma.cartao.findUnique({ where: { chave_acesso: chave } })
  if (!cartao) return reply.status(404).send({ error: 'Cartão não encontrado.' })
  // @ts-ignore — modelo adicionado ao schema, types regenerados no build
  await prisma.visualizacao.create({ data: { cartao_id: cartao.id } })
  return { ok: true }
})

// Retorna contagem de visualizações dos cartões do usuário logado
fastify.get('/usuarios/meus-analytics', async (request, reply) => {
  try {
    await request.jwtVerify()
    const usuarioId = (request.user as any).id
    const cartoes = await prisma.cartao.findMany({ where: { usuario_id: usuarioId } })
    const sete_dias_atras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const resultados = await Promise.all(cartoes.map(async (c) => {
      // @ts-ignore — modelo adicionado ao schema, types regenerados no build
      const total = await prisma.visualizacao.count({ where: { cartao_id: c.id } })
      // @ts-ignore
      const ultimos7dias = await prisma.visualizacao.count({
        where: { cartao_id: c.id, criado_em: { gte: sete_dias_atras } }
      })
      return { chave_acesso: c.chave_acesso, nome_perfil: c.nome_perfil, total, ultimos7dias }
    }))

    return resultados
  } catch {
    return reply.status(401).send({ error: 'Não autorizado.' })
  }
})

// Rota de Health Check
fastify.get('/ping', async (request, reply) => {
  return { status: 'Vitualll! Tá no brilho!', timestamp: new Date() }
})

// Rota para resgatar/validar o cartão pela chave de acesso
fastify.get('/cartoes/acesso/:chave', async (request, reply) => {
  const { chave } = request.params as { chave: string }
  
  const cartao = await prisma.cartao.findUnique({
    where: { chave_acesso: chave },
    include: { tags_fisicas: true }
  })

  if (!cartao) {
    return reply.status(404).send({ error: 'Cartão não encontrado, anjo. Verifica essa chave aí!' })
  }

  return cartao
})

// Upload de imagem para um cartão (foto, capa, logo)
fastify.post('/cartoes/acesso/:chave/upload', async (request, reply) => {
  try {
    await request.jwtVerify()
    const { chave } = request.params as { chave: string }
    const usuarioId = (request.user as any).id

    const cartao = await prisma.cartao.findUnique({ where: { chave_acesso: chave } })
    if (!cartao) return reply.status(404).send({ error: 'Cartão não encontrado.' })
    if (cartao.usuario_id !== usuarioId && !(request.user as any).empresa_id) {
      return reply.status(403).send({ error: 'Sem permissão para editar esse cartão.' })
    }

    const data = await request.file()
    if (!data) return reply.status(400).send({ error: 'Arquivo não enviado.' })

    const tipo = (data.fields as any)?.tipo?.value || 'photo'
    const allowed = ['photo', 'cover', 'logo']
    if (!allowed.includes(tipo)) return reply.status(400).send({ error: 'Tipo inválido.' })

    const ext = data.filename.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${chave}-${tipo}-${Date.now()}.${ext}`
    const filepath = path.join(uploadDir, filename)
    await pipeline(data.file, fs.createWriteStream(filepath))

    return { url: `/uploads/${filename}` }
  } catch (err) {
    return reply.status(401).send({ error: 'Não autorizado.' })
  }
})

// Rota para atualizar o cartão via chave de acesso (Protegido para o Cliente)
fastify.put('/cartoes/acesso/:chave', async (request, reply) => {
  try {
    await request.jwtVerify()
    const { chave } = request.params as { chave: string }
    const data = request.body as any
    const usuarioId = (request.user as any).id
    
    const cartao = await prisma.cartao.findUnique({ where: { chave_acesso: chave } })

    if (!cartao) {
      return reply.status(404).send({ error: 'Cartão não encontrado! Yukê?!' })
    }

    if (cartao.usuario_id !== usuarioId && !(request.user as any).empresa_id) {
       return reply.status(403).send({ error: 'Você não tem permissão para editar esse cartão, anjo!' })
    }

    const updated = await prisma.cartao.update({
      where: { chave_acesso: chave },
      data: {
        nome_perfil: data.nome_perfil,
        cargo: data.cargo,
        telefone: data.telefone,
        whatsapp: data.whatsapp,
        bio: data.bio,
        link_google_reviews: data.link_google_reviews,
        dados_json: data.dados_json
      }
    })

    return updated
  } catch (err) {
    return reply.status(401).send({ error: 'Não autorizado. Faça login primeiro!' })
  }
})

// --- Rotas de Usuário (Cliente Final) ---
fastify.post('/usuarios/register', async (request, reply) => {
  const { nome, email, telefone, chave_acesso, senha } = request.body as any

  // Verifica se a chave existe
  const cartao = await prisma.cartao.findUnique({ where: { chave_acesso } })
  if (!cartao) {
    return reply.status(400).send({ error: 'Chave de acesso inválida, gatinha!' })
  }
  
  if (cartao.usuario_id) {
    return reply.status(400).send({ error: 'Essa chave já foi atrelada a uma conta! Desvia do recalque.' })
  }

  // Verifica se o email já existe
  const userExistente = await prisma.usuario.findUnique({ where: { email } })
  if (userExistente) {
    return reply.status(400).send({ error: 'Email já cadastrado!' })
  }

  const usuario = await prisma.usuario.create({
    data: { nome, email, telefone, senha_hash: await bcrypt.hash(senha, 10) }
  })

  // Vincula o cartão ao usuário
  await prisma.cartao.update({
    where: { id: cartao.id },
    data: { usuario_id: usuario.id }
  })

  const token = fastify.jwt.sign({ id: usuario.id, email: usuario.email, tipo: 'usuario' })
  return reply.status(201).send({ usuario, token })
})

fastify.post('/usuarios/login', async (request, reply) => {
  const { email, senha } = request.body as any
  const usuario = await prisma.usuario.findUnique({ where: { email } })
  
  if (!usuario || !(await bcrypt.compare(senha, usuario.senha_hash))) {
    return reply.status(401).send({ error: 'Email ou senha incorretos. Tenta de novo, amor!' })
  }

  const token = fastify.jwt.sign({ id: usuario.id, email: usuario.email, tipo: 'usuario' })
  return { token, usuario }
})

fastify.get('/usuarios/meus-cartoes', async (request, reply) => {
  try {
    await request.jwtVerify()
    const usuarioId = (request.user as any).id
    
    const cartoes = await prisma.cartao.findMany({
      where: { usuario_id: usuarioId }
    })
    
    return cartoes
  } catch (err) {
    return reply.status(401).send({ error: 'Não autorizado.' })
  }
})

// --- Rotas de Empresa ---
fastify.post('/empresas', async (request, reply) => {
  const { nome, email, senha } = request.body as any
  // Simplificação: em produção use bcrypt para hash
  const empresa = await prisma.empresa.create({
    data: { nome, email, senha_hash: await bcrypt.hash(senha, 10) }
  })
  return reply.status(201).send(empresa)
})

fastify.post('/empresas/login', async (request, reply) => {
  const { email, senha } = request.body as any
  const empresa = await prisma.empresa.findUnique({ where: { email } })
  if (!empresa || !(await bcrypt.compare(senha, empresa.senha_hash))) {
    return reply.status(401).send({ error: 'Acesso negado, gatinha! Credenciais inválidas.' })
  }
  const token = fastify.jwt.sign({ id: empresa.id, email: empresa.email, tipo: 'empresa' })
  return { token }
})

// --- Rotas Protegidas (Criação de Cartão pela Empresa) ---
fastify.post('/cartoes', async (request, reply) => {
  try {
    await request.jwtVerify()
    const { chave_acesso, titulo, ...rest } = request.body as any
    const cartao = await prisma.cartao.create({
      data: {
        chave_acesso,
        ...rest,
        empresa_id: (request.user as any).id
      }
    })
    return reply.status(201).send(cartao)
  } catch (err) {
    return reply.status(401).send({ error: 'Token inválido ou ausente! Desvia do recalque.' })
  }
})

// --- Rotas Exclusivas do Admin (Empresa) ---
fastify.post('/admin/gerar-chave', async (request, reply) => {
  try {
    await request.jwtVerify()
    if ((request.user as any).tipo !== 'empresa') {
      return reply.status(403).send({ error: 'Apenas a mamãe admin pode fazer isso!' })
    }

    // Gera uma chave aleatória de 8 dígitos alfanuméricos
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let chave = ''
    for (let i = 0; i < 8; i++) {
      chave += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    const cartao = await prisma.cartao.create({
      data: {
        chave_acesso: chave,
        empresa_id: (request.user as any).id,
        ativo: true
      }
    })

    return reply.status(201).send({ chave_acesso: chave, id: cartao.id })
  } catch (err) {
    return reply.status(401).send({ error: 'Não autorizado.' })
  }
})

fastify.patch('/admin/cartoes/:id/toggle', async (request, reply) => {
  try {
    await request.jwtVerify()
    if ((request.user as any).tipo !== 'empresa') return reply.status(403).send({ error: 'Acesso restrito!' })
    const { id } = request.params as { id: string }
    const cartao = await prisma.cartao.findUnique({ where: { id: parseInt(id) } })
    if (!cartao) return reply.status(404).send({ error: 'Cartão não encontrado.' })
    const updated = await prisma.cartao.update({ where: { id: parseInt(id) }, data: { ativo: !cartao.ativo } })
    return { ativo: updated.ativo }
  } catch {
    return reply.status(401).send({ error: 'Não autorizado.' })
  }
})

fastify.get('/admin/cartoes', async (request, reply) => {
  try {
    await request.jwtVerify()
    if ((request.user as any).tipo !== 'empresa') {
      return reply.status(403).send({ error: 'Acesso restrito!' })
    }

    const cartoes = await prisma.cartao.findMany({
      include: {
        usuario: { select: { nome: true, email: true } }
      },
      orderBy: { criado_em: 'desc' }
    })

    return cartoes
  } catch (err) {
    return reply.status(401).send({ error: 'Não autorizado.' })
  }
})

// --- Rotas de Produtos (Marketplace) ---
fastify.get('/produtos', async (request, reply) => {
  const produtos = await prisma.produto.findMany({
    where: { ativo: true },
    orderBy: { criado_em: 'desc' }
  })
  return produtos
})

fastify.post('/admin/produtos', async (request, reply) => {
  try {
    await request.jwtVerify()
    if ((request.user as any).tipo !== 'empresa') {
      return reply.status(403).send({ error: 'Apenas admin pode criar produtos!' })
    }

    const data = await request.file()
    if (!data) {
      return reply.status(400).send({ error: 'A imagem é obrigatória!' })
    }

    let fields: any = {}
    for (const key in data.fields) {
       // @ts-ignore
       if(data.fields[key].value) fields[key] = data.fields[key].value
    }

    const nome = fields.nome || 'Produto sem nome'
    const descricao = fields.descricao || ''
    const preco = parseFloat(fields.preco || '0')
    let preco_promocional = fields.preco_promocional ? parseFloat(fields.preco_promocional) : null
    
    const filename = `${Date.now()}-${data.filename}`
    const filepath = path.join(uploadDir, filename)
    await pipeline(data.file, fs.createWriteStream(filepath))

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco,
        preco_promocional,
        imagem_url: `/uploads/${filename}`,
        ativo: true
      }
    })

    return reply.status(201).send(produto)
  } catch (err) {
    console.error(err)
    return reply.status(401).send({ error: 'Erro ao processar produto.' })
  }
})

fastify.put('/admin/produtos/:id', async (request, reply) => {
  try {
    await request.jwtVerify()
    if ((request.user as any).tipo !== 'empresa') return reply.status(403).send({ error: 'Apenas admin!' })
    const { id } = request.params as { id: string }

    const data = await request.file()
    let fields: any = {}
    if (data) {
      for (const key in data.fields) {
        // @ts-ignore
        if (data.fields[key].value) fields[key] = data.fields[key].value
      }
    } else {
      Object.assign(fields, request.body as any)
    }

    const updateData: any = {}
    if (fields.nome) updateData.nome = fields.nome
    if (fields.descricao !== undefined) updateData.descricao = fields.descricao
    if (fields.preco) updateData.preco = parseFloat(fields.preco)
    if (fields.preco_promocional !== undefined) updateData.preco_promocional = fields.preco_promocional ? parseFloat(fields.preco_promocional) : null
    if (fields.ativo !== undefined) updateData.ativo = fields.ativo === 'true'

    if (data?.file) {
      const filename = `${Date.now()}-${data.filename}`
      const filepath = path.join(uploadDir, filename)
      await pipeline(data.file, fs.createWriteStream(filepath))
      updateData.imagem_url = `/uploads/${filename}`
    }

    const produto = await prisma.produto.update({ where: { id: parseInt(id) }, data: updateData })
    return produto
  } catch (err) {
    return reply.status(500).send({ error: 'Erro ao atualizar produto.' })
  }
})

fastify.delete('/admin/produtos/:id', async (request, reply) => {
  try {
    await request.jwtVerify()
    if ((request.user as any).tipo !== 'empresa') {
      return reply.status(403).send({ error: 'Apenas admin!' })
    }
    const { id } = request.params as { id: string }
    await prisma.produto.update({
      where: { id: parseInt(id) },
      data: { ativo: false }
    })
    return reply.send({ success: true })
  } catch(e) {
     return reply.status(500).send({ error: 'Erro ao deletar' })
  }
})

// --- Envio de convite por email (Admin) ---
fastify.post('/admin/enviar-convite', async (request, reply) => {
  try {
    await request.jwtVerify()
    if ((request.user as any).tipo !== 'empresa') {
      return reply.status(403).send({ error: 'Apenas admin pode fazer isso!' })
    }
    const { email, chave } = request.body as { email: string, chave: string }
    if (!email || !chave) return reply.status(400).send({ error: 'Email e chave são obrigatórios.' })

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3005'
    const link = frontendUrl + '/cadastro?chave=' + chave

    await enviarEmail(
      email,
      'Seu cartão digital está pronto!',
      '<h2>Olá!</h2><p>Você foi convidado(a) para criar seu cartão digital personalizado.</p>' +
      '<p>Clique no botão abaixo para criar sua conta:</p>' +
      '<p><a href="' + link + '" style="background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Criar minha conta</a></p>' +
      '<p style="color:#888;font-size:12px;">Ou acesse: ' + link + '</p>'
    )

    return { ok: true, link }
  } catch (err: any) {
    return reply.status(500).send({ error: 'Erro ao enviar convite: ' + (err.message || '') })
  }
})

// --- Recuperação de senha ---
fastify.post('/usuarios/esqueci-senha', async (request, reply) => {
  const { email } = request.body as { email: string }
  const usuario = await prisma.usuario.findUnique({ where: { email } })
  if (usuario) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let token = ''
    for (let i = 0; i < 8; i++) token += chars.charAt(Math.floor(Math.random() * chars.length))
    const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

    // @ts-ignore — campos adicionados ao schema, types regenerados no build
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { reset_token: token, reset_token_expiry: expiry }
    })

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3005'
    const link = frontendUrl + '/resetar-senha?token=' + token

    await enviarEmail(
      email,
      'Redefinição de senha — Smart vCard',
      '<h2>Redefinição de senha</h2>' +
      '<p>Recebemos um pedido de redefinição de senha para sua conta.</p>' +
      '<p><a href="' + link + '" style="background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Redefinir minha senha</a></p>' +
      '<p style="color:#888;font-size:12px;">Link válido por 1 hora. Se você não solicitou isso, ignore este email.</p>'
    )
  }
  return { ok: true }
})

fastify.post('/usuarios/resetar-senha', async (request, reply) => {
  const { token, nova_senha } = request.body as { token: string, nova_senha: string }
  if (!token || !nova_senha) return reply.status(400).send({ error: 'Token e nova senha são obrigatórios.' })

  // @ts-ignore — campos adicionados ao schema, types regenerados no build
  const usuario = await prisma.usuario.findFirst({
    where: { reset_token: token, reset_token_expiry: { gt: new Date() } }
  })
  if (!usuario) return reply.status(400).send({ error: 'Token inválido ou expirado.' })

  // @ts-ignore
  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { senha_hash: await bcrypt.hash(nova_senha, 10), reset_token: null, reset_token_expiry: null }
  })
  return { ok: true }
})

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001
    await fastify.listen({ port, host: '0.0.0.0' })
    fastify.log.info(`Servidor babadeiro rodando na porta ${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
