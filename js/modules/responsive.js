// ==============================================================================
// ARTECREAM - Responsive & Multi-Device Engine
// Manages viewport units (--app-height), breakpoints, smooth scroll,
// scroll-spy, drawer toggle, and keyboard/touch events.
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
        if (typeof closeFlavorModal === 'function') {
          closeFlavorModal();
        }
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
