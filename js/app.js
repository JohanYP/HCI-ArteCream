// ==============================================================================
// ARTECREAM - Main Landing Page Script (index.html)
// Handles dynamic rendering of catalog cards and preview modal
// ==============================================================================

let currentModalFlavor = null;
let currentModalQty = 1;

// Product detail navigation
function openFlavorPage(flavorId) {
  window.location.href = 'pages/producto.html?id=' + encodeURIComponent(flavorId);
}

// Render dynamic flavor cards in index.html from FLAVORS_DATA
function renderCatalogGrid() {
  const grid = document.getElementById('flavors-catalog-grid');
  if (!grid || typeof FLAVORS_DATA === 'undefined') return;

  grid.innerHTML = '';

  Object.keys(FLAVORS_DATA).forEach((key) => {
    const item = FLAVORS_DATA[key];
    const card = document.createElement('div');
    card.className = 'flavor-card group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-elevation-1 hover:shadow-elevation-hover transition-all duration-300 flex flex-col border border-on-surface/5 hover:-translate-y-1.5 h-full cursor-pointer relative';
    card.onclick = () => openFlavorPage(key);
    card.setAttribute('aria-label', `Ver descripción de ${item.name}`);

    card.innerHTML = `
      <!-- Card Image Container with Badge -->
      <div class="relative w-full aspect-[4/5] bg-surface-container-low overflow-hidden shrink-0 rounded-t-3xl">
        <img alt="Helado artesanal ${item.name}" class="w-full h-full object-cover object-center rounded-t-3xl group-hover:scale-105 transition-transform duration-300" src="${item.img}">
        
        <!-- Gourmet Origin Badge -->
        ${item.badge ? `
          <div class="absolute top-4 left-4 z-10">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md text-[11px] font-bold text-primary shadow-sm border border-on-surface/5 tracking-wide uppercase">
              <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
              ${item.badge}
            </span>
          </div>
        ` : ''}
      </div>

      <!-- Card Info -->
      <div class="p-6 sm:p-7 flex-1 flex flex-col justify-between font-sans">
        <div class="min-h-[3.5rem] sm:min-h-[4rem] flex flex-col justify-start">
          <h3 class="font-sans text-xl sm:text-2xl font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">
            ${item.name}
          </h3>
          ${item.origin ? `<span class="text-xs text-on-surface-variant font-medium mt-1">${item.origin}</span>` : ''}
        </div>
        <div class="flex items-center justify-between pt-3 border-t border-on-surface/5 mt-auto">
          <div>
            <span class="font-sans text-xl font-bold text-on-surface">${item.priceFormatted}</span>
          </div>
          <!-- Square Cart Button -->
          <button class="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary hover:bg-primary-container text-on-primary shadow-sm hover:scale-105 active:scale-95 transition-all duration-200" onclick="event.preventDefault(); event.stopPropagation(); addToOrder('${item.name}', ${item.price}, 1);" title="Agregar al pedido" type="button">
            <span class="material-symbols-outlined text-[22px]">add_shopping_cart</span>
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// Quick preview modal (if opened)
function openFlavorModal(flavorId) {
  const flavor = (typeof FLAVORS_DATA !== 'undefined') ? FLAVORS_DATA[flavorId] : null;
  if (!flavor) {
    openFlavorPage(flavorId);
    return;
  }

  currentModalFlavor = flavor;
  currentModalQty = 1;

  const modal = document.getElementById('flavor-modal');
  const titleEl = document.getElementById('modal-flavor-title');
  const priceEl = document.getElementById('modal-flavor-price');
  const descEl = document.getElementById('modal-flavor-desc');
  const imgEl = document.getElementById('modal-flavor-img');
  const qtyEl = document.getElementById('modal-quantity');

  if (titleEl) titleEl.textContent = flavor.name;
  if (priceEl) priceEl.textContent = flavor.priceFormatted;
  if (descEl) descEl.textContent = flavor.desc;
  if (imgEl) {
    imgEl.src = flavor.img;
    imgEl.alt = 'Helado artesanal ' + flavor.name;
  }
  if (qtyEl) qtyEl.textContent = currentModalQty;

  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.ResponsiveEngine && typeof ResponsiveEngine.lockBodyScroll === 'function') {
      ResponsiveEngine.lockBodyScroll(true);
    }
  }
}

function closeFlavorModal() {
  const modal = document.getElementById('flavor-modal');
  if (modal && !modal.classList.contains('hidden')) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    if (window.ResponsiveEngine && typeof ResponsiveEngine.lockBodyScroll === 'function') {
      ResponsiveEngine.lockBodyScroll(false);
    }
  }
}

function changeModalQuantity(delta) {
  currentModalQty = Math.max(1, currentModalQty + delta);
  const qtyEl = document.getElementById('modal-quantity');
  if (qtyEl) qtyEl.textContent = currentModalQty;
}

function submitModalOrder() {
  if (!currentModalFlavor) return;
  addToOrder(currentModalFlavor.name, currentModalFlavor.price * currentModalQty, currentModalQty);
  closeFlavorModal();
}

// Page initialization
document.addEventListener('DOMContentLoaded', () => {
  renderCatalogGrid();

  if (window.ResponsiveEngine && typeof ResponsiveEngine.init === 'function') {
    ResponsiveEngine.init();
  }

  const modal = document.getElementById('flavor-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeFlavorModal();
      }
    });
  }
});