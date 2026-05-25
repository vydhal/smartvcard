import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const fastify: FastifyInstance = Fastify({ logger: true })

fastify.register(cors, { origin: '*' })

fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecret123'
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

  // Cria o usuário
  const usuario = await prisma.usuario.create({
    data: { nome, email, telefone, senha_hash: senha } // Em prod, use bcrypt!
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
  
  if (!usuario || usuario.senha_hash !== senha) {
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
    data: { nome, email, senha_hash: senha }
  })
  return reply.status(201).send(empresa)
})

fastify.post('/empresas/login', async (request, reply) => {
  const { email, senha } = request.body as any
  const empresa = await prisma.empresa.findUnique({ where: { email } })
  if (!empresa || empresa.senha_hash !== senha) {
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
