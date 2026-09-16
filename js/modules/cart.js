// ==============================================================================
// ARTECREAM - Cart & Notification Engine
// Handles persistent shopping cart count with localStorage and feedback toasts.
// ==============================================================================

const CartService = {
  storageKey: 'artecream_cart_items_count',
  toastTimer: null,

  init() {
    this.refreshCounter();
  },

  getItemCount() {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? parseInt(saved, 10) || 0 : 0;
  },

  setItemCount(count) {
    localStorage.setItem(this.storageKey, Math.max(0, count));
    this.refreshCounter();
  },

  addItem(quantity = 1) {
    const nextCount = this.getItemCount() + quantity;
    this.setItemCount(nextCount);
    return nextCount;
  },

  refreshCounter() {
    const count = this.getItemCount();
    const cartBadges = document.querySelectorAll('#cart-counter');
    cartBadges.forEach((badge) => {
      badge.textContent = count;
      if (count > 0) {
        badge.classList.remove('scale-0');
        badge.classList.add('scale-100');
      } else {
        badge.classList.remove('scale-100');
        badge.classList.add('scale-0');
      }
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
  }
};

// Global helper functions for backwards compatibility with HTML inline onclicks
function addToOrder(flavorName, price, quantity = 1) {
  CartService.addItem(quantity);
  const formattedPrice = typeof price === 'number' ? '$' + price.toLocaleString('es-CO') + ' COP' : price;
  CartService.showToast(
    quantity > 1 ? `${flavorName} (${quantity} un.)` : flavorName,
    `${formattedPrice} añadido a la cesta térmica.`
  );
}

function openOrderModal() {
  addToOrder('Caja 4 Sabores Artecream', 31000, 1);
}

document.addEventListener('DOMContentLoaded', () => {
  CartService.init();
});
