// ==============================================================================
// ARTECREAM - Cart & Drawer Engine
// Manages real cart items, quantities, subtotal, localStorage persistence,
// feedback toasts, and slide-over interactive cart drawer.
// ==============================================================================

const CartService = {
  storageKey: 'artecream_cart_items_v2',
  toastTimer: null,

  init() {
    this.refreshCartBadge();
    this.setupCartDrawer();
  },

  getCart() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error parsing cart from storage:', e);
      return [];
    }
  },

  saveCart(cart) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.refreshCartBadge();
    this.renderCartDrawer();
  },

  getTotalCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.qty || 1), 0);
  },

  getSubtotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + ((item.price || 0) * (item.qty || 1)), 0);
  },

  addItem(flavorId, name, price, img, quantity = 1) {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === flavorId || item.name === name);

    if (existingIndex > -1) {
      cart[existingIndex].qty += quantity;
    } else {
      cart.push({
        id: flavorId || name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        price: price,
        img: img || '',
        qty: quantity
      });
    }

    this.saveCart(cart);
    const addedItemTotal = price * quantity;
    this.showToast(
      quantity > 1 ? `${name} (${quantity} un.)` : name,
      `$${addedItemTotal.toLocaleString('es-CO')} COP añadido a la cesta térmica.`
    );
  },

  updateQuantity(index, delta) {
    const cart = this.getCart();
    if (!cart[index]) return;

    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }

    this.saveCart(cart);
  },

  removeItem(index) {
    const cart = this.getCart();
    if (cart[index]) {
      cart.splice(index, 1);
      this.saveCart(cart);
    }
  },

  clearCart() {
    this.saveCart([]);
  },

  refreshCartBadge() {
    const totalCount = this.getTotalCount();
    const badges = document.querySelectorAll('#cart-counter');
    badges.forEach((badge) => {
      badge.textContent = totalCount;
      badge.classList.remove('scale-0');
      badge.classList.add('scale-100');
    });
  },

  showToast(titleText, descText, duration = 3200) {
    const toast = document.getElementById('cart-toast');
    const title = document.getElementById('toast-title');
    const desc = document.getElementById('toast-desc');

    if (title) title.textContent = titleText;
    if (desc) desc.textContent = descText;

    if (toast) {
      toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
      toast.classList.add('translate-y-0', 'opacity-100');

      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
        toast.classList.remove('translate-y-0', 'opacity-100');
      }, duration);
    }
  },

  // Setup Slide-over Cart Drawer DOM if not already in page
  setupCartDrawer() {
    if (document.getElementById('cart-drawer-container')) return;

    const drawerHtml = `
      <div id="cart-drawer-container" class="fixed inset-0 z-50 pointer-events-none transition-all duration-300">
        <!-- Backdrop -->
        <div id="cart-backdrop" class="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 pointer-events-none" onclick="CartService.closeDrawer()"></div>
        
        <!-- Drawer Panel -->
        <div id="cart-panel" class="absolute top-0 right-0 h-full w-full max-w-md bg-surface-bright shadow-2xl flex flex-col transform translate-x-full transition-transform duration-300 pointer-events-auto border-l border-on-surface/10 font-sans">
          
          <!-- Header -->
          <div class="p-6 border-b border-on-surface/10 flex items-center justify-between bg-surface">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-2xl">local_mall</span>
              <h2 class="text-xl font-bold text-on-surface font-sans">Cesta Térmica</h2>
            </div>
            <button onclick="CartService.closeDrawer()" class="w-9 h-9 rounded-xl hover:bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors" aria-label="Cerrar cesta">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Items List Container -->
          <div id="cart-items-container" class="flex-1 overflow-y-auto p-6 space-y-4">
            <!-- Rendered dynamically -->
          </div>

          <!-- Footer Summary -->
          <div id="cart-footer" class="p-6 border-t border-on-surface/10 bg-surface space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm text-on-surface-variant">
                <span>Empaque térmico artesanal</span>
                <span class="text-xs font-semibold text-primary uppercase tracking-wider">Incluido</span>
              </div>
              <div class="flex items-center justify-between text-lg font-bold text-on-surface pt-2 border-t border-on-surface/5">
                <span>Subtotal</span>
                <span id="cart-subtotal-val" class="text-primary font-bold text-xl">$0 COP</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-2.5 pt-2">
              <button onclick="CartService.simulateCheckout()" class="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-base shadow-md hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-xl">shopping_cart_checkout</span>
                <span>Continuar compra</span>
              </button>
              <button onclick="CartService.clearCart()" class="w-full py-2.5 px-4 rounded-xl text-xs text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors font-medium text-center">
                Vaciar cesta
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', drawerHtml);
    this.renderCartDrawer();
  },

  openDrawer() {
    this.renderCartDrawer();
    const container = document.getElementById('cart-drawer-container');
    const backdrop = document.getElementById('cart-backdrop');
    const panel = document.getElementById('cart-panel');

    if (container && backdrop && panel) {
      container.classList.remove('pointer-events-none');
      backdrop.classList.remove('pointer-events-none', 'opacity-0');
      backdrop.classList.add('opacity-100');
      panel.classList.remove('translate-x-full');
      panel.classList.add('translate-x-0');
      document.body.style.overflow = 'hidden';
    }
  },

  closeDrawer() {
    const container = document.getElementById('cart-drawer-container');
    const backdrop = document.getElementById('cart-backdrop');
    const panel = document.getElementById('cart-panel');

    if (container && backdrop && panel) {
      backdrop.classList.remove('opacity-100');
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      panel.classList.remove('translate-x-0');
      panel.classList.add('translate-x-full');
      setTimeout(() => {
        container.classList.add('pointer-events-none');
        document.body.style.overflow = '';
      }, 300);
    }
  },

  renderCartDrawer() {
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const footer = document.getElementById('cart-footer');
    if (!container) return;

    const cart = this.getCart();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div class="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/40">
            <span class="material-symbols-outlined text-4xl">remove_shopping_cart</span>
          </div>
          <p class="text-base font-bold text-on-surface font-sans">Tu cesta está vacía</p>
          <p class="text-xs text-on-surface-variant max-w-xs leading-relaxed">
            Descubre nuestra selección de helados elaborados con ingredientes autóctonos colombianos.
          </p>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '$0 COP';
      return;
    }

    let itemsHtml = '';
    const isInsidePages = window.location.pathname.includes('/pages/');

    cart.forEach((item, index) => {
      const itemTotal = (item.price * item.qty).toLocaleString('es-CO');
      let imgPath = item.img || '';
      if (imgPath && isInsidePages && !imgPath.startsWith('../') && !imgPath.startsWith('http')) {
        imgPath = '../' + imgPath;
      } else if (imgPath && !isInsidePages && imgPath.startsWith('../')) {
        imgPath = imgPath.replace(/^\.\.\//, '');
      }

      itemsHtml += `
        <div class="p-4 rounded-2xl bg-surface-container-low border border-on-surface/5 flex gap-4 items-center">
          ${imgPath ? `
            <div class="w-16 h-16 rounded-xl bg-surface-container overflow-hidden shrink-0">
              <img src="${imgPath}" alt="${item.name}" class="w-full h-full object-cover">
            </div>
          ` : ''}
          <div class="flex-1 min-w-0">
            <h4 class="font-sans font-bold text-sm text-on-surface truncate">${item.name}</h4>
            <p class="text-xs font-semibold text-primary mt-0.5">$${itemTotal} COP</p>
            <div class="flex items-center gap-2 mt-2">
              <button onclick="CartService.updateQuantity(${index}, -1)" class="w-7 h-7 rounded-lg bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface shadow-xs text-xs font-bold transition-colors">
                -
              </button>
              <span class="text-xs font-bold text-on-surface px-1 min-w-[18px] text-center">${item.qty}</span>
              <button onclick="CartService.updateQuantity(${index}, 1)" class="w-7 h-7 rounded-lg bg-surface-container-lowest hover:bg-surface-container flex items-center justify-center text-on-surface shadow-xs text-xs font-bold transition-colors">
                +
              </button>
            </div>
          </div>
          <button onclick="CartService.removeItem(${index})" class="text-on-surface-variant hover:text-error p-2 transition-colors" title="Eliminar sabor">
            <span class="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      `;
    });

    container.innerHTML = itemsHtml;
    if (subtotalEl) {
      subtotalEl.textContent = `$${this.getSubtotal().toLocaleString('es-CO')} COP`;
    }
  },

  simulateCheckout() {
    alert('¡Gracias por elegir ArteCream!\nTu cesta con un total de ' + `$${this.getSubtotal().toLocaleString('es-CO')} COP` + ' está lista.');
  }
};

// Global helper bindings for backward compatibility with onclicks in templates
function addToOrder(flavorName, price, quantity = 1) {
  let img = '';
  let flavorId = '';

  if (typeof FLAVORS_DATA !== 'undefined') {
    for (const key in FLAVORS_DATA) {
      if (FLAVORS_DATA[key].name.toLowerCase() === flavorName.toLowerCase() || key === flavorName) {
        flavorId = key;
        img = FLAVORS_DATA[key].img;
        break;
      }
    }
  }

  CartService.addItem(flavorId, flavorName, price, img, quantity);
}

function openOrderModal() {
  CartService.openDrawer();
}

document.addEventListener('DOMContentLoaded', () => {
  CartService.init();
});
