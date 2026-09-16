// ==============================================================================
// ARTECREAM - User Profile & Club de Cata Service
// Manages lightweight customer session, points, and modal dialog
// ==============================================================================

const UserService = {
  storageKey: 'artecream_user_profile_v1',

  getUser() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading user profile:', e);
      return null;
    }
  },

  saveUser(userData) {
    localStorage.setItem(this.storageKey, JSON.stringify(userData));
    this.render();
  },

  logout() {
    localStorage.removeItem(this.storageKey);
    this.render();
    if (typeof CartService !== 'undefined' && CartService.showToast) {
      CartService.showToast('Sesión finalizada', 'Esperamos verte pronto en ArteCream.');
    }
  },

  init() {
    this.setupModalDOM();
    this.render();
  },

  setupModalDOM() {
    if (document.getElementById('user-profile-modal')) return;

    const modalHtml = `
      <div id="user-profile-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 sm:p-6 font-sans">
        <!-- Backdrop -->
        <div id="user-modal-backdrop" class="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300" onclick="UserService.closeModal()"></div>

        <!-- Modal Box -->
        <div class="relative w-full max-w-md bg-surface-bright rounded-3xl shadow-2xl border border-on-surface/10 overflow-hidden z-10 transition-all transform duration-300 scale-95 opacity-0 font-sans" id="user-modal-card">
          
          <!-- Header -->
          <div class="px-6 sm:px-8 pt-7 pb-4 flex items-center justify-between border-b border-on-surface/5 bg-surface">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <span class="material-symbols-outlined text-2xl">workspace_premium</span>
              </div>
              <div>
                <h3 class="font-serif text-xl sm:text-2xl font-bold text-on-surface leading-tight">Club de Cata</h3>
                <p class="text-xs text-on-surface-variant">Experiencia de Autor ARTECREAM</p>
              </div>
            </div>
            <button onclick="UserService.closeModal()" class="w-9 h-9 rounded-xl hover:bg-surface-container flex items-center justify-center text-on-surface hover:text-primary transition-colors" aria-label="Cerrar ventana">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <!-- Dynamic Body Container -->
          <div id="user-modal-body" class="p-6 sm:p-8 space-y-6">
            <!-- Rendered dynamically depending on session state -->
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  openModal() {
    this.setupModalDOM();
    this.render();
    const modal = document.getElementById('user-profile-modal');
    const card = document.getElementById('user-modal-card');

    if (modal && card) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      setTimeout(() => {
        card.classList.remove('scale-95', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
      }, 20);
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal() {
    const modal = document.getElementById('user-profile-modal');
    const card = document.getElementById('user-modal-card');

    if (modal && card) {
      card.classList.remove('scale-100', 'opacity-100');
      card.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
      }, 250);
    }
  },

  render() {
    const body = document.getElementById('user-modal-body');
    if (!body) return;

    const user = this.getUser();

    if (!user) {
      // Estado: Formulario de Registro Ultra Rápido (Solo Nombre y Correo)
      body.innerHTML = `
        <div class="space-y-4">
          <div class="text-left space-y-1">
            <h4 class="font-bold text-base text-on-surface">Únete a nuestra membresía</h4>
            <p class="text-xs text-on-surface-variant leading-relaxed">
              Disfruta de notas de cata exclusivas, novedades de cosecha y acumula puntos en cada compra.
            </p>
          </div>

          <form id="user-quick-form" onsubmit="UserService.handleRegister(event)" class="space-y-3.5 pt-1">
            <div>
              <label class="block text-xs font-semibold text-on-surface mb-1.5" for="user-name-input">Nombre completo</label>
              <input id="user-name-input" type="text" required placeholder="Ej. Sebastián Gómez" class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-on-surface/10 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-sans">
            </div>
            <div>
              <label class="block text-xs font-semibold text-on-surface mb-1.5" for="user-email-input">Correo electrónico</label>
              <input id="user-email-input" type="email" required placeholder="tu@correo.com" class="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-on-surface/10 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-sans">
            </div>

            <div class="pt-2">
              <button type="submit" class="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shadow-md hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-lg">how_to_reg</span>
                <span>Ingresar al Club</span>
              </button>
            </div>
          </form>

          <p class="text-[11px] text-center text-on-surface-variant/70 pt-1">
            Sin contraseñas complicadas. Tu perfil se guarda de forma segura en este navegador.
          </p>
        </div>
      `;
    } else {
      // Estado: Socio Autenticado con Tarjeta de Membresía
      const memberInitials = user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      const points = user.points || 150;

      body.innerHTML = `
        <div class="space-y-5">
          <!-- Tarjeta Virtual de Membresía -->
          <div class="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-primary-container to-primary text-on-primary shadow-lg relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none"></div>
            <div class="flex items-start justify-between relative z-10">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-lg text-white">
                  ${memberInitials}
                </div>
                <div>
                  <h4 class="font-bold text-base leading-tight">${user.name}</h4>
                  <span class="text-xs text-on-primary/80 font-medium">Socio Gourmet ArteCream</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-white/30 text-3xl">local_florist</span>
            </div>

            <div class="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs">
              <div>
                <span class="text-white/70 block text-[10px] uppercase tracking-wider font-semibold">Puntos de Cuchara</span>
                <span class="font-bold text-lg text-white">${points} pts</span>
              </div>
              <div class="text-right">
                <span class="text-white/70 block text-[10px] uppercase tracking-wider font-semibold">Estado</span>
                <span class="inline-flex items-center gap-1 font-semibold text-white/95">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Activo
                </span>
              </div>
            </div>
          </div>

          <!-- Información del perfil -->
          <div class="p-4 rounded-xl bg-surface-container-low border border-on-surface/5 space-y-2 text-xs text-on-surface-variant">
            <div class="flex items-center justify-between">
              <span class="font-medium">Correo registrado:</span>
              <span class="font-bold text-on-surface">${user.email}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="font-medium">Beneficio activo:</span>
              <span class="text-primary font-semibold">10% de cortesía en cajas de autor</span>
            </div>
          </div>

          <!-- Botones de Acción -->
          <div class="space-y-2 pt-1">
            <button onclick="UserService.closeModal()" class="w-full py-3 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs transition-colors">
              Continuar navegando
            </button>
            <button onclick="UserService.logout()" class="w-full py-2 px-4 rounded-xl text-xs text-error hover:bg-error-container/20 transition-colors font-medium text-center">
              Cerrar sesión de socio
            </button>
          </div>
        </div>
      `;
    }
  },

  handleRegister(e) {
    e.preventDefault();
    const nameInput = document.getElementById('user-name-input');
    const emailInput = document.getElementById('user-email-input');

    if (!nameInput || !emailInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) return;

    this.saveUser({
      name: name,
      email: email,
      points: 150,
      joinedAt: new Date().toISOString()
    });

    if (typeof CartService !== 'undefined' && CartService.showToast) {
      CartService.showToast(`¡Bienvenido, ${name}!`, 'Te has unido al Club de Cata ArteCream con 150 puntos de bienvenida.');
    }
  }
};

// Global helper for user profile icon clicks
function openUserProfileModal() {
  UserService.openModal();
}

document.addEventListener('DOMContentLoaded', () => {
  UserService.init();
});
