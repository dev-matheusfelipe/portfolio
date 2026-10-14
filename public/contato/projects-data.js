'use strict';

// Cadastre novos projetos aqui. Use a versão real de uma release ou null.
// category: frontend, backend, fullstack ou ferramentas.
// url: site do projeto ou repositório específico, sempre um endereço válido.
const projectCatalog = [
  {
    name: 'Revolts',
    description: 'Plataforma de publicidade para empresas com ranking por investimento acumulado, filtros por localização e segmento, painel de anunciantes e modo demonstração.',
    category: 'fullstack',
    status: 'Demonstração publicada',
    statusTone: 'available',
    version: null,
    url: 'https://revolts.vercel.app/',
    destination: 'Abrir plataforma',
    icon: 'studio'
  },

  {
    name: 'Portfólio pessoal',
    description: 'Minha trajetória, áreas de atuação e trabalho em desenvolvimento de produtos digitais. Um ponto de encontro para conhecer o que faço.',
    category: 'frontend',
    status: 'Publicado',
    statusTone: 'available',
    version: null,
    url: 'https://matheusfelipe.dev.br',
    destination: 'Abrir site',
    icon: 'globe'
  },
  {
    name: 'Cartão digital',
    description: 'Contato e redes em um só lugar, com perfis por contexto, QR Code, compartilhamento e download do contato.',
    category: 'frontend',
    status: 'Em evolução',
    statusTone: 'progress',
    version: 'v0.1.0',
    url: '/contato/?perfil=professional',
    destination: 'Abrir projeto',
    icon: 'contact'
  },
  {
    name: 'Cloner',
    description: 'Ferramenta em Node.js para baixar o HTML e arquivos estáticos de um site e organizar imagens, estilos e scripts em diretórios locais.',
    category: 'ferramentas',
    status: 'Código disponível',
    statusTone: 'available',
    version: null,
    url: 'https://github.com/dev-matheusfelipe/copiar-clonar-site-com-nodejs',
    destination: 'Ver no GitHub',
    icon: 'code'
  },
  {
    name: 'TINA',
    description: 'Experimento de interação por voz no navegador. Interface em HTML, CSS e JavaScript com comandos e respostas usando a biblioteca Artyom.js.',
    category: 'frontend',
    status: 'Código disponível',
    statusTone: 'available',
    version: null,
    url: 'https://github.com/dev-matheusfelipe/I.A---TINA',
    destination: 'Ver no GitHub',
    icon: 'voice'
  }
];
