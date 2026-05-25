const fs = require('fs');
const path = require('path');

const pages = {
  'privacy-policy/index.vue': {
    title: 'Política de Privacidade',
    content: '<p>A sua privacidade é importante para nós. É política da Simplisoft respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no nosso site.</p><br/><p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.</p><br/><p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, os protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>'
  },
  'terms-of-service/index.vue': {
    title: 'Termos de Serviço',
    content: '<p>Ao acessar ao site da Simplisoft, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.</p><br/><p>Os materiais exibidos no site da Simplisoft são fornecidos "como estão". A Simplisoft não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização.</p>'
  },
  'cookie-policy/index.vue': {
    title: 'Política de Cookies',
    content: '<p>Como é prática comum em quase todos os sites profissionais, este site usa cookies, que são pequenos arquivos baixados no seu computador, para melhorar sua experiência. Esta página descreve quais informações eles coletam, como as usamos e por que às vezes precisamos armazenar esses cookies.</p><br/><p>Nós utilizamos cookies para diversos fins, como permitir o funcionamento de certas áreas da plataforma, lembrar as suas preferências de usuário, etc. Você pode desativar o uso de cookies no seu navegador, porém isso pode afetar a funcionalidade deste e de muitos outros sites que você visita.</p>'
  },
  'acceptable-use-policy/index.vue': {
    title: 'Política de Uso Aceitável',
    content: '<p>Esta Política de Uso Aceitável descreve as diretrizes para o uso dos serviços da Simplisoft. É estritamente proibido utilizar nossa plataforma para propagar conteúdo ilegal, ofensivo, difamatório ou que viole direitos autorais.</p><br/><p>Reservamo-nos o direito de suspender ou encerrar qualquer conta ou cartão digital que for flagrado violando estas diretrizes, sem aviso prévio.</p>'
  },
  'customer-support/index.vue': {
    title: 'Suporte ao Cliente',
    content: '<p>Estamos aqui para ajudar! Se você tiver dúvidas, problemas ou precisar de assistência com o seu Cartão Digital, entre em contato conosco.</p><br/><p>Você pode enviar um email para suporte@simplisoft.com.br ou entrar em contato através das nossas redes sociais. Nosso horário de atendimento é de segunda a sexta, em horário comercial.</p>'
  },
  'hosting-guide/index.vue': {
    title: 'Guia de Hospedagem',
    content: '<p>Você pode hospedar o seu Cartão Digital diretamente com a Simplisoft ou baixar os arquivos gerados (HTML/CSS) para hospedar no seu próprio domínio e servidor.</p><br/><p>Para hospedar no seu próprio servidor, basta descompactar os arquivos baixados e enviá-los via FTP para o seu diretório web público (public_html, www, etc).</p>'
  },
  'training/index.vue': {
    title: 'Treinamento e Tutoriais',
    content: '<p>Aprenda a tirar o máximo proveito do seu Cartão Digital Vitualll! Nesta seção você encontrará dicas de como configurar seu perfil, escolher os melhores links e compartilhar seu QR Code de forma eficiente.</p><br/><p>Em breve disponibilizaremos vídeos e tutoriais passo a passo. Fique ligado!</p>'
  }
};

const template = (title, content) => `<template>
  <div class="container relative bg-gray-900 mx-auto text-gray-100" style="max-width: 960px">
    <div class="px-4">
      <div class="flex items-start justify-between pt-8">
        <NuxtLink to="/">
          <div class="logo w-24" style="width: 8rem !important; margin-top: -25px" v-html="require(\`~/assets/icons/logo.svg?include\`)" title="Simplisoft"></div>
        </NuxtLink>
        <Header />
      </div>
      <div class="max-w-screen-sm min-h-screen">
        <h1 class="text-3xl md:text-5xl font-extrabold mt-24 md:leading-tight mb-8">
          ${title}
        </h1>
        <div class="text-gray-300 text-lg leading-relaxed">
          ${content}
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default {
  components: { Header, Footer },
  head: {
    titleTemplate: '${title} - %s'
  }
}
</script>
`;

for (const [file, data] of Object.entries(pages)) {
  const fullPath = path.join(__dirname, 'pages', file);
  if (fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, template(data.title, data.content));
    console.log('Translated: ' + file);
  }
}
