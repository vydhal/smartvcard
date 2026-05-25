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

const featuredReplacements = {
  'Section title': 'Título da seção',
  'Type your own section title': 'Digite o título da sua seção',
  'Remove section': 'Remover seção',
  'Attach media': 'Anexar mídia',
  'Add text': 'Adicionar texto',
  'Add product': 'Adicionar produto',
  'Custom Button': 'Botão Custom.',
  'iframe code': 'Código iframe',
  'Embed code': 'Código embutido',
  'Type text content here': 'Digite o conteúdo do texto aqui',
  'Paste HTML embed code here': 'Cole o código HTML embutido aqui',
  'Paste  JavaScript code here': 'Cole o código JavaScript aqui',
  'Remove media': 'Remover mídia'
};

replaceInFile('components/Featured.vue', featuredReplacements);

const productReplacements = {
  'Product title': 'Título do produto',
  'Product description': 'Descrição do produto',
  'Product price': 'Preço do produto',
  'Button label': 'Texto do botão',
  'Button link': 'Link do botão',
  'Remove product': 'Remover produto',
  'Attach product image': 'Anexar imagem do produto'
};

replaceInFile('components/ProductCard.vue', productReplacements);

const customBtnReplacements = {
  'Button label': 'Texto do botão',
  'Button link': 'Link do botão'
};

replaceInFile('components/CustomButton.vue', customBtnReplacements);

// Modify Preview.vue to add the carousel class and CSS
let previewContent = fs.readFileSync('components/Preview.vue', 'utf8');
previewContent = previewContent.replace(
  '<div v-for="(item, i) in item.content" :key="i">',
  '<div class="carousel-container"><div v-for="(item, i) in item.content" :key="i" class="carousel-item">'
);
previewContent = previewContent.replace(
  '</div>\n            </div>\n          </main>',
  '</div></div>\n            </div>\n          </main>'
);

// Add CSS for the carousel if not already there
if (!previewContent.includes('.carousel-container')) {
  previewContent = previewContent.replace('</style>', `
  .carousel-container {
    display: flex;
    overflow-x: auto;
    gap: 1rem;
    padding-bottom: 1rem;
    padding-top: 1rem;
    scroll-snap-type: x mandatory;
    scrollbar-width: none; /* Firefox */
  }
  .carousel-container::-webkit-scrollbar { 
    display: none; /* Safari and Chrome */
  }
  .carousel-item {
    flex: 0 0 85%;
    scroll-snap-align: center;
  }
  .carousel-item .content.image img {
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .carousel-item .content.embedded iframe {
    border-radius: 8px;
  }
</style>`);
}

fs.writeFileSync('components/Preview.vue', previewContent);
console.log('Modified Preview.vue for horizontal carousel');
