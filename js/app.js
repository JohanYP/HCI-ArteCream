// ==============================================================================
// ARTECREAM - Main Landing Page Script (index.html)
// ==============================================================================

let currentModalFlavor = null;
let currentModalQty = 1;

// Product detail navigation
function openFlavorPage(flavorId) {
  window.location.href = 'producto.html?id=' + encodeURIComponent(flavorId);
}

// Quick preview modal (if opened from landing page cards)
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