// Artecream - E-commerce & Modal Interaction Logic

const FLAVORS_DATA = {
  'queso-bocadillo': {
    name: 'Queso con bocadillo',
    price: 8500,
    priceFormatted: '$8.500 COP',
    img: 'flavor-queso-bocadillo.png',
    desc: 'Cremosa base láctea elaborada con leche de pastoreo sostenible y queso campesino fresco de Santander, veteada generosamente con trozos de auténtico bocadillo veleño de guayaba roja. El contraste perfecto entre notas dulces acarameladas y el toque lácteo salino tradicional.'
  },
  'lulo': {
    name: 'Lulo',
    price: 8000,
    priceFormatted: '$8.000 COP',
    img: 'flavor-lulo.png',
    desc: 'Puro sorbete artesanal a base de pulpa fresca de lulos silvestres cosechados en el Pacífico chocoano. Su perfil intensamente cítrico y refrescante equilibra la acidez viva de la fruta con notas herbales y una textura ligera que limpia el paladar.'
  },
  'mora': {
    name: 'Mora',
    price: 8000,
    priceFormatted: '$8.000 COP',
    img: 'flavor-mora.jpg',
    desc: 'Reducción artesanal a fuego lento de moras de Castilla cosechadas en altura en los campos de Boyacá. Posee una untuosidad sedosa inconfundible, color rubí oscuro y un sabor profundo con notas a frutos del bosque silvestres.'
  },
  'maracuya': {
    name: 'Maracuyá',
    price: 8000,
    priceFormatted: '$8.000 COP',
    img: 'flavor-maracuya.jpg',
    desc: 'Elaborado con maracuyá madurado bajo el sol del Eje Cafetero, conservando sus semillas crujientes para una experiencia multisensorial. Aromático, chispeante y con el balance exacto entre acidez tropical y frescura revitalizante.'
  }
};

let currentModalFlavor = null;
let currentModalQty = 1;
let cartItemCount = 0;

// Open Product Detail - Navigate to individual product description page
function openFlavorPage(flavorId) {
  window.location.href = 'producto.html?id=' + encodeURIComponent(flavorId);
}

function openFlavorModal(flavorId) {
  window.location.href = 'producto.html?id=' + encodeURIComponent(flavorId);
}

// Close Product Detail Modal
function closeFlavorModal() {
  const modal = document.getElementById('flavor-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }
}

// Change Quantity in Modal
function changeModalQuantity(delta) {
  currentModalQty = Math.max(1, currentModalQty + delta);
  const qtyEl = document.getElementById('modal-quantity');
  if (qtyEl) qtyEl.textContent = currentModalQty;
}

// Submit Order from Modal
function submitModalOrder() {
  if (!currentModalFlavor) return;
  addToOrder(currentModalFlavor.name, currentModalFlavor.price * currentModalQty, currentModalQty);
  closeFlavorModal();
}

// Toast Notification & Cart Counter Updater
let toastTimer;
function addToOrder(flavorName, price, quantity = 1) {
  cartItemCount += quantity;
  const cartBadge = document.getElementById('cart-counter');
  if (cartBadge) {
    cartBadge.textContent = cartItemCount;
    cartBadge.classList.remove('scale-0');
    cartBadge.classList.add('scale-100');
  }

  const toast = document.getElementById('cart-toast');
  const title = document.getElementById('toast-title');
  const desc = document.getElementById('toast-desc');

  if (title) {
    title.textContent = quantity > 1 ? `${flavorName} (${quantity} un.)` : flavorName;
  }
  if (desc) {
    desc.textContent = '$' + price.toLocaleString('es-CO') + ' COP añadido a la cesta térmica.';
  }

  if (toast) {
    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3200);
  }
}

function openOrderModal() {
  addToOrder('Caja 4 Sabores Artecream', 31000, 1);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('menu-toggle');
  if (!menu || !btn) return;
  const icon = btn.querySelector('.material-symbols-outlined');
  const isOpen = menu.classList.toggle('hidden');
  btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  if (icon) icon.textContent = isOpen ? 'menu' : 'close';
}

// Keyboard and Backdrop click listener for modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeFlavorModal();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('flavor-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeFlavorModal();
      }
    });
  }
});