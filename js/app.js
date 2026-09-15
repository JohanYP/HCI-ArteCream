// ==============================================================================
// ARTECREAM - Master Application & Responsive Device Engine
// Helados Artesanales de Autor
// ==============================================================================

/**
 * Flavors Catalog Data
 */
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
let toastTimer = null;

// ==============================================================================
// RESPONSIVE & MULTI-DEVICE ENGINE
// Handles screen breakpoints, dynamic viewport units (--app-height), touch
// detection, active navigation scroll-spy, and seamless mobile drawer states.
// ==============================================================================

const ResponsiveEngine = {
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1536
  },

  state: {
    currentCategory: null,
    isTouch: false,
    headerHeight: 80,
    scrollLockActive: false
  },

  init() {
    this.updateViewportHeight();
    this.detectInputType();
    this.updateDeviceClassification();
    this.setupSmoothScroll();
    this.setupScrollSpy();
    this.setupMobileMenuHandlers();
    this.setupEventListeners();
  },

  /**
   * Fixes mobile 100vh bugs (address bar hide/reveal) by calculating real innerHeight
   */
  updateViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);

    const header = document.querySelector('header');
    if (header) {
      this.state.headerHeight = header.offsetHeight || 80;
      document.documentElement.style.setProperty('--header-height', `${this.state.headerHeight}px`);
    }
  },

  /**
   * Detects touch capability vs precision mouse cursor
   */
  detectInputType() {
    this.state.isTouch = (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    );

    if (this.state.isTouch) {
      document.documentElement.classList.add('touch-device');
      document.documentElement.classList.remove('pointer-fine');
    } else {
      document.documentElement.classList.add('pointer-fine');
      document.documentElement.classList.remove('touch-device');
    }
  },

  /**
   * Categorizes viewport size into mobile, tablet, desktop, or ultrawide
   */
  updateDeviceClassification() {
    const width = window.innerWidth;
    let category = 'mobile';

    if (width >= this.breakpoints.desktop) {
      category = 'ultrawide';
    } else if (width >= this.breakpoints.tablet) {
      category = 'desktop';
    } else if (width >= this.breakpoints.mobile) {
      category = 'tablet';
    } else {
      category = 'mobile';
    }

    if (this.state.currentCategory !== category) {
      document.documentElement.classList.remove('screen-mobile', 'screen-tablet', 'screen-desktop', 'screen-ultrawide');
      document.documentElement.classList.add(`screen-${category}`);
      this.state.currentCategory = category;

      // Close mobile drawer if resized to desktop or wide
      if (width >= this.breakpoints.tablet) {
        closeMobileMenu();
      }
    }
  },

  /**
   * Smooth scroll interceptor taking fixed navbar height into exact account
   */
  setupSmoothScroll() {
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMobileMenu();
        return;
      }

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        closeMobileMenu();

        const headerOffset = this.state.headerHeight + 16;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });

        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // If page loaded with a hash (e.g. #nosotros or #sabores)
    if (window.location.hash) {
      setTimeout(() => {
        const initialTarget = document.getElementById(window.location.hash.substring(1));
        if (initialTarget) {
          const headerOffset = this.state.headerHeight + 16;
          const elementPosition = initialTarget.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({ top: Math.max(0, offsetPosition), behavior: 'smooth' });
        }
      }, 150);
    }
  },

  /**
   * ScrollSpy using IntersectionObserver to highlight active navigation link
   */
  setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observerOptions = {
      root: null,
      rootMargin: `-${this.state.headerHeight}px 0px -50% 0px`,
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.setActiveNavLink(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  },

  setActiveNavLink(sectionId) {
    // Desktop Nav Links
    const desktopLinks = document.querySelectorAll('#desktop-nav .nav-link');
    desktopLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const isActive = href === `#${sectionId}` || (sectionId === 'inicio' && (href === '#' || href === '#inicio'));

      if (isActive) {
        link.classList.add('text-primary', 'font-bold', 'border-primary');
        link.classList.remove('text-on-surface-variant', 'border-transparent');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('text-primary', 'font-bold', 'border-primary');
        link.classList.add('text-on-surface-variant', 'border-transparent');
        link.removeAttribute('aria-current');
      }
    });

    // Mobile Drawer Links
    const mobileLinks = document.querySelectorAll('#mobile-menu .mobile-nav-link');
    mobileLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const isActive = href === `#${sectionId}` || (sectionId === 'inicio' && (href === '#' || href === '#inicio'));

      if (isActive) {
        link.classList.add('bg-primary-container', 'text-on-primary', 'font-bold');
        link.classList.remove('text-on-surface-variant', 'hover:bg-surface-container-low');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('bg-primary-container', 'text-on-primary', 'font-bold');
        link.classList.add('text-on-surface-variant');
        link.removeAttribute('aria-current');
      }
    });
  },

  /**
   * Outside-click and keyboard handlers for mobile navigation drawer
   */
  setupMobileMenuHandlers() {
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('mobile-menu');
      const btn = document.getElementById('menu-toggle');
      if (!menu || !btn) return;

      const isOpen = !menu.classList.contains('hidden');
      if (isOpen && !menu.contains(e.target) && !btn.contains(e.target)) {
        closeMobileMenu();
      }
    });
  },

  /**
   * Global listeners: debounced resize, orientation change, escape key
   */
  setupEventListeners() {
    let resizeTimeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.updateViewportHeight();
        this.updateDeviceClassification();
      }, 100);
    };

    window.addEventListener('resize', debouncedResize, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.updateViewportHeight();
        this.updateDeviceClassification();
      }, 200);
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        closeFlavorModal();
      }
    });
  },

  /**
   * Locks background body scroll cleanly when modal or full drawer is opened
   */
  lockBodyScroll(lock) {
    if (lock && !this.state.scrollLockActive) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
      this.state.scrollLockActive = true;
    } else if (!lock && this.state.scrollLockActive) {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      this.state.scrollLockActive = false;
    }
  }
};

// ==============================================================================
// NAVIGATION DRAWER (MOBILE)
// ==============================================================================

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('menu-toggle');
  if (!menu || !btn) return;

  const icon = btn.querySelector('.material-symbols-outlined');
  const isCurrentlyHidden = menu.classList.contains('hidden');

  if (isCurrentlyHidden) {
    menu.classList.remove('hidden');
    btn.setAttribute('aria-expanded', 'true');
    if (icon) icon.textContent = 'close';
  } else {
    menu.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
    if (icon) icon.textContent = 'menu';
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('menu-toggle');
  if (!menu) return;

  if (!menu.classList.contains('hidden')) {
    menu.classList.add('hidden');
    if (btn) {
      btn.setAttribute('aria-expanded', 'false');
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'menu';
    }
  }
}

// ==============================================================================
// PRODUCT NAVIGATION & MODAL INTERACTION
// ==============================================================================

function openFlavorPage(flavorId) {
  window.location.href = 'producto.html?id=' + encodeURIComponent(flavorId);
}

function openFlavorModal(flavorId) {
  const flavor = FLAVORS_DATA[flavorId];
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
    ResponsiveEngine.lockBodyScroll(true);
  }
}

function closeFlavorModal() {
  const modal = document.getElementById('flavor-modal');
  if (modal && !modal.classList.contains('hidden')) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    ResponsiveEngine.lockBodyScroll(false);
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

// ==============================================================================
// CART & TOAST FEEDBACK
// ==============================================================================

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

// ==============================================================================
// INITIALIZATION
// ==============================================================================

document.addEventListener('DOMContentLoaded', () => {
  ResponsiveEngine.init();

  const modal = document.getElementById('flavor-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeFlavorModal();
      }
    });
  }
});