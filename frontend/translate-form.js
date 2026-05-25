const fs = require('fs');

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [en, pt] of Object.entries(replacements)) {
    content = content.replace(new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), pt);
  }
  fs.writeFileSync(filePath, content);
  console.log('Translated: ' + filePath);
}

const indexReplacements = {
  'Header Image': 'Imagem de Cabeçalho',
  'Select between a logo or cover photo': 'Escolha entre um logotipo ou foto de capa',
  'Brand Logo': 'Logotipo da Marca',
  'Cover Photo': 'Foto de Capa',
  'Upload your brand logo': 'Envie o logotipo da sua marca',
  'suggested format: svg, png or gif': 'formato sugerido: svg, png ou gif',
  'Recommended brand logo size is 350 x 100 pixels.': 'O tamanho recomendado para o logotipo é 350 x 100 pixels.',
  'Add cover photo': 'Adicionar foto de capa',
  'suggested format: svg, jpeg, png or gif': 'formato sugerido: svg, jpeg, png ou gif',
  'Recommended cover size is 960 x 640 pixels, with an expect': 'O tamanho recomendado para a capa é 960 x 640 pixels, com uma proporção',
  'ratio of 3:2.': 'de 3:2.',
  'vCard information': 'Informações do Cartão',
  'Upload your headshot': 'Envie sua foto de perfil',
  'Recommended headshot is 300 x 300 pixels.': 'O tamanho recomendado para a foto é 300 x 300 pixels.',
  'Prefix': 'Prefixo',
  'First name': 'Nome',
  'Last name': 'Sobrenome',
  'Gender pronouns': 'Pronomes',
  'Job title': 'Cargo',
  'Business name': 'Nome da Empresa',
  'Business address': 'Endereço da Empresa',
  'Street Address': 'Endereço (Rua, Número)',
  'City': 'Cidade',
  'State': 'Estado',
  'Postal Code': 'CEP',
  'Country': 'País',
  'Business description': 'Descrição da Empresa',
  'Primary actions': 'Ações Principais',
  'Search an action': 'Pesquisar uma ação',
  'Secondary actions': 'Ações Secundárias',
  'Featured content': 'Conteúdo em Destaque',
  'Attach content': 'Anexar conteúdo',
  'Add section': 'Adicionar seção',
  'Supported media file formats: jpeg, png, mp3, mp4, webm and pdf': 'Formatos de arquivo suportados: jpeg, png, mp3, mp4, webm e pdf',
  'Customize the footer credit?': 'Personalizar o crédito no rodapé?',
  'You have an active agency license.': 'Você possui uma licença de agência ativa.',
  'No, thanks': 'Não, obrigado',
  'Footer text': 'Texto do Rodapé',
  'Created by': 'Criado por',
  'Link Text': 'Texto do Link',
  'Your Brand': 'Sua Marca',
  'Simplify Your Visible vCard?': 'Simplificar seu Cartão Digital visível?',
  'Encourage downloads and hide icons': 'Incentivar downloads e ocultar ícones',
  'Customize Your Favicon?': 'Personalizar o seu Favicon?',
  'Yes, I will host my own favicon image': 'Sim, eu vou hospedar minha própria imagem de favicon',
  'Enter secure (https://) image URL here': 'Insira a URL segura (https://) da imagem aqui',
  'Recommended image size is 100 x 100 png': 'O tamanho recomendado para a imagem é 100 x 100 png',
  'Customize Your Share Image?': 'Personalizar sua Imagem de Compartilhamento?',
  'Yes, I will host my own share image': 'Sim, eu vou hospedar minha própria imagem de compartilhamento',
  'Recommended image size is 1200 x 630 png': 'O tamanho recomendado para a imagem é 1200 x 630 png',
  'Customize Your Bookmark Image?': 'Personalizar a Imagem de Favoritos?',
  'Yes, I will host my own Bookmark image. This is supported on iPhone only, not on Android.': 'Sim, vou hospedar minha própria imagem de favoritos. Isso é suportado apenas no iPhone.',
  'Recommended image size is 128 x 128 png': 'O tamanho recomendado para a imagem é 128 x 128 png',
  'Enter your bookmark title': 'Insira o título dos favoritos',
  'Customize your Meta Data': 'Personalizar seus Metadados',
  'Yes, I will customize my meta data': 'Sim, vou personalizar meus metadados',
  'Enter your personal name or business name': 'Insira o seu nome pessoal ou nome da empresa',
  'Name': 'Nome',
  'Content': 'Conteúdo'
};

replaceInFile('pages/index.vue', indexReplacements);

// Also translate Preview
const previewReplacements = {
  'LIVE PREVIEW': 'PRÉVIA AO VIVO'
};
replaceInFile('components/Preview.vue', previewReplacements);
