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
