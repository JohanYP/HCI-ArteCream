// Artecream - Catálogo Centralizado de Sabores de Autor

const FLAVORS_DATA = {
  'queso-bocadillo': {
    id: 'queso-bocadillo',
    name: 'Queso con bocadillo',
    badge: 'Guayaba Veleña',
    origin: 'Santander & Boyacá',
    price: 8500,
    priceFormatted: '$8.500 COP',
    img: 'assets/images/flavor-queso-bocadillo.png',
    desc: 'Cremosa base láctea elaborada con leche de pastoreo sostenible y queso campesino fresco de Santander, veteada generosamente con trozos de auténtico bocadillo veleño de guayaba roja. El contraste perfecto entre notas dulces acarameladas y el toque lácteo salino tradicional.'
  },
  'lulo': {
    id: 'lulo',
    name: 'Lulo',
    badge: '100% Fruta Silvestre',
    origin: 'Chocó Biogeográfico',
    price: 8000,
    priceFormatted: '$8.000 COP',
    img: 'assets/images/flavor-lulo.png',
    desc: 'Puro sorbete artesanal a base de pulpa fresca de lulos silvestres cosechados en el Pacífico chocoano. Su perfil intensamente cítrico y refrescante equilibra la acidez viva de la fruta con notas herbales y una textura ligera que limpia el paladar.'
  },
  'mora': {
    id: 'mora',
    name: 'Mora',
    badge: 'Mora de Castilla',
    origin: 'Campos de Boyacá',
    price: 8000,
    priceFormatted: '$8.000 COP',
    img: 'assets/images/flavor-mora.jpg',
    desc: 'Reducción artesanal a fuego lento de moras de Castilla cosechadas en altura en los campos de Boyacá. Posee una untuosidad sedosa inconfundible, color rubí oscuro y un sabor profundo con notas a frutos del bosque silvestres.'
  },
  'maracuya': {
    id: 'maracuya',
    name: 'Maracuyá',
    badge: 'Cosecha Tropical',
    origin: 'Eje Cafetero',
    price: 8000,
    priceFormatted: '$8.000 COP',
    img: 'assets/images/flavor-maracuya.jpg',
    desc: 'Elaborado con maracuyá madurado bajo el sol del Eje Cafetero, conservando sus semillas crujientes para una experiencia multisensorial. Aromático, chispeante y con el balance exacto entre acidez tropical y frescura revitalizante.'
  }
};

// Compatibilidad
const FLAVORS_CATALOG = FLAVORS_DATA;
