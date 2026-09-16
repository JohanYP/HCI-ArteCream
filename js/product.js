// ==============================================================================
// ARTECREAM - Product Detail Page Script (producto.html)
// ==============================================================================

let selectedFlavorId = 'queso-bocadillo';
let currentQty = 1;

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function initPage() {
  const paramId = getQueryParam('id') || getQueryParam('sabor') || 'queso-bocadillo';
  if (typeof FLAVORS_DATA !== 'undefined' && FLAVORS_DATA[paramId]) {
    selectedFlavorId = paramId;
  }

  const flavor = FLAVORS_DATA[selectedFlavorId];
  if (!flavor) return;

  document.title = flavor.name + ' | ARTECREAM';
  
  const pageTitle = document.getElementById('page-title');
  if (pageTitle) pageTitle.textContent = flavor.name + ' | ARTECREAM';

  const breadcrumb = document.getElementById('breadcrumb-title');
  if (breadcrumb) breadcrumb.textContent = flavor.name;

  const title = document.getElementById('flavor-title');
  if (title) title.textContent = flavor.name;

  const price = document.getElementById('flavor-price');
  if (price) price.textContent = flavor.priceFormatted;

  const desc = document.getElementById('flavor-description');
  if (desc) desc.textContent = flavor.desc;

  const imgEl = document.getElementById('flavor-image');
  if (imgEl) {
    imgEl.src = flavor.img;
    imgEl.alt = 'Helado artesanal ' + flavor.name;
  }

  renderOtherFlavors();
}

function changeQuantity(delta) {
  currentQty = Math.max(1, currentQty + delta);
  const qtyEl = document.getElementById('product-quantity');
  if (qtyEl) qtyEl.textContent = currentQty;
}

function submitOrder() {
  const flavor = FLAVORS_DATA[selectedFlavorId];
  if (!flavor) return;
  addToOrder(flavor.name, flavor.price * currentQty, currentQty);
}

function addOtherToCart(name, price) {
  addToOrder(name, price, 1);
}

// Render Other Flavors with elongated vertical cards
function renderOtherFlavors() {
  const grid = document.getElementById('other-flavors-grid');
  if (!grid || typeof FLAVORS_DATA === 'undefined') return;
  grid.innerHTML = '';

  Object.keys(FLAVORS_DATA).forEach(key => {
    if (key === selectedFlavorId) return;
    const item = FLAVORS_DATA[key];

    const card = document.createElement('a');
    card.href = 'producto.html?id=' + encodeURIComponent(key);
    card.className = 'flavor-card group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-elevation-1 hover:shadow-elevation-hover transition-all duration-300 flex flex-col border border-on-surface/5 hover:-translate-y-1.5 h-full cursor-pointer';
    card.setAttribute('aria-label', 'Ver descripción de ' + item.name);
    card.innerHTML = `
      <div class="relative w-full h-72 sm:h-80 bg-surface-container-low overflow-hidden shrink-0 rounded-t-3xl">
        <img src="${item.img}" alt="Helado artesanal ${item.name}" class="w-full h-full object-cover object-center rounded-t-3xl">
      </div>
      <div class="p-6 sm:p-7 flex-1 flex flex-col justify-between font-sans">
        <div class="min-h-[3.5rem] sm:min-h-[4rem] flex items-start">
          <h3 class="font-sans text-xl sm:text-2xl font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
            ${item.name}
          </h3>
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-on-surface/5 mt-auto">
          <div>
            <span class="font-sans text-xl font-bold text-on-surface">${item.priceFormatted}</span>
          </div>
          <!-- Square cart button with rounded borders -->
          <button class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary shadow-sm hover:scale-105 active:scale-95 transition-all duration-200" onclick="event.preventDefault(); event.stopPropagation(); addOtherToCart('${item.name}', ${item.price});" title="Agregar al pedido" type="button">
            <span class="material-symbols-outlined text-[22px]">add_shopping_cart</span>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  initPage();
  if (window.ResponsiveEngine && typeof ResponsiveEngine.init === 'function') {
    ResponsiveEngine.init();
  }
});
