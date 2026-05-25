const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'backend/src/server.ts');
let content = fs.readFileSync(filePath, 'utf8');

const imports = `import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import path from 'path'
import fs from 'fs'
import { pipeline } from 'stream/promises'
import { PrismaClient } from '@prisma/client'`;

content = content.replace(/import Fastify.*@prisma\/client'/s, imports);

const registrations = `fastify.register(jwt, {
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
}`;

content = content.replace(/fastify.register\(jwt, {[\s\S]*?}\)/, registrations);

const routes = `// --- Rotas de Produtos (Marketplace) ---
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
    
    const filename = \`\${Date.now()}-\${data.filename}\`
    const filepath = path.join(uploadDir, filename)
    await pipeline(data.file, fs.createWriteStream(filepath))

    const produto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco,
        preco_promocional,
        imagem_url: \`/uploads/\${filename}\`,
        ativo: true
      }
    })

    return reply.status(201).send(produto)
  } catch (err) {
    console.error(err)
    return reply.status(401).send({ error: 'Erro ao processar produto.' })
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

const start = async () => {`;

content = content.replace('const start = async () => {', routes);

fs.writeFileSync(filePath, content, 'utf8');
console.log("server.ts updated");
