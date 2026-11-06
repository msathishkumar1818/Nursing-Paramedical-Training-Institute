/**
 * Apex Nursing & Paramedical Training Institute
 * Global Core JavaScript (Vanilla JS)
 * Handles: Preloader, Dark Mode, RTL/LTR, Click-Only Dropdowns, Mobile Drawer, Scroll-to-Top, Active Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initTheme();
  initDirection();
  initDesktopDropdown();
  initMobileMenu();
  initMobileAccordion();
  initScrollToTop();
  highlightActiveNav();
  initAuthTabs();
  initDashboardTabs();
});

/* ==========================================================================
   1. BRANDED PRELOADER
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const hidePreloader = () => {
    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  };

  // Fade out on window load or safe fallback
  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 300);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 300));
    // Failsafe in case of delayed resource loading
    setTimeout(hidePreloader, 2500);
  }
}

/* ==========================================================================
   2. DARK MODE SYSTEM (Strict #000000)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('theme');
  
  // If user previously toggled to dark, use dark; otherwise default to clean light mode
  const isDark = storedTheme === 'dark';
  applyTheme(isDark);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentlyDark = document.documentElement.classList.contains('dark');
      const newThemeIsDark = !currentlyDark;
      applyTheme(newThemeIsDark);
      localStorage.setItem('theme', newThemeIsDark ? 'dark' : 'light');
    });
  });
}

function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }
  updateThemeIcons(isDark);
}

function updateThemeIcons(isDark) {
  const sunIcons = document.querySelectorAll('.theme-sun-icon');
  const moonIcons = document.querySelectorAll('.theme-moon-icon');

  sunIcons.forEach(icon => {
    icon.style.display = isDark ? 'block' : 'none';
  });
  moonIcons.forEach(icon => {
    icon.style.display = isDark ? 'none' : 'block';
  });
}

/* ==========================================================================
   3. RTL / LTR SYSTEM
   ========================================================================== */
function initDirection() {
  const dirToggleBtns = document.querySelectorAll('.dir-toggle-btn');
  const storedDir = localStorage.getItem('direction') || 'ltr';

  applyDirection(storedDir);

  dirToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      localStorage.setItem('direction', newDir);
    });
  });
}

function applyDirection(dir) {
  document.documentElement.setAttribute('dir', dir);
  const dirLabels = document.querySelectorAll('.dir-label-text');
  dirLabels.forEach(label => {
    label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
  });
}

/* ==========================================================================
   4. DESKTOP HOME DROPDOWN (STRICTLY CLICK ONLY - HOVER NEVER OPENS)
   ========================================================================== */
function initDesktopDropdown() {
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle-btn');

  dropdownToggles.forEach(toggle => {
    const parent = toggle.closest('.dropdown-wrapper');
    if (!parent) return;
    const panel = parent.querySelector('.dropdown-panel');
    if (!panel) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = panel.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) {
        panel.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Close on click of dropdown items
    const items = panel.querySelectorAll('a');
    items.forEach(item => {
      item.addEventListener('click', () => {
        closeAllDropdowns();
      });
    });
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-wrapper')) {
      closeAllDropdowns();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-panel.open').forEach(p => p.classList.remove('open'));
  document.querySelectorAll('.dropdown-toggle-btn[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
}

/* ==========================================================================
   5. MOBILE DRAWER MENU
   ========================================================================== */
function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-open-btn');
  const closeBtn = document.getElementById('mobile-menu-close-btn');
  const drawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');

  if (!drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    closeAllMobileAccordions();
  };

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && (drawer.classList.contains('open') || backdrop.classList.contains('open'))) {
      closeDrawer();
    }
  });

  // Close mobile menu when ANY nav link is clicked
  const navLinks = drawer.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

function closeAllMobileAccordions() {
  const contents = document.querySelectorAll('.mobile-accordion-content');
  const btns = document.querySelectorAll('.mobile-accordion-toggle');
  const icons = document.querySelectorAll('.accordion-chevron-icon');
  contents.forEach(c => c.classList.remove('open'));
  btns.forEach(b => b.setAttribute('aria-expanded', 'false'));
  icons.forEach(i => { i.style.transform = 'rotate(0deg)'; });
}

/* ==========================================================================
   6. MOBILE ACCORDION (FOR HOME 1 & HOME 2 SUBMENU)
   ========================================================================== */
function initMobileAccordion() {
  const accordionBtns = document.querySelectorAll('.mobile-accordion-toggle');

  accordionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parent = btn.closest('.mobile-accordion-wrapper');
      if (!parent) return;
      const content = parent.querySelector('.mobile-accordion-content');
      const icon = btn.querySelector('.accordion-chevron-icon');

      if (content) {
        const isOpen = content.classList.contains('open');
        if (isOpen) {
          // Automatic close if already open
          content.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          // Open dropdown
          content.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          if (icon) icon.style.transform = 'rotate(180deg)';
        }
      }
    });
  });

  // Automatic close: when clicking any other link or button in the mobile menu, close accordion
  const otherMobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-sub-link');
  otherMobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeAllMobileAccordions();
    });
  });
}

/* ==========================================================================
   7. SCROLL-TO-TOP BUTTON
   ========================================================================== */
function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-to-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. ACTIVE NAVIGATION HIGHLIGHT (HOME 1 vs HOME 2 + INNER PAGES)
   ========================================================================== */
function highlightActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  let pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
  if (!pageName || pageName === '/' || pageName === './') pageName = 'index.html';

  const isHome1 = pageName === 'index.html';
  const isHome2 = pageName === 'home-2.html';
  const isAnyHome = isHome1 || isHome2;

  // 1. Desktop Nav Links & Dropdown items
  const desktopLinks = document.querySelectorAll('.desktop-nav-group .nav-link:not(.dropdown-toggle-btn), .desktop-nav-group .dropdown-item');
  desktopLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('?')[0].split('#')[0].toLowerCase();
    if (pageName === cleanHref || (isHome1 && cleanHref === 'index.html') || (isHome2 && cleanHref === 'home-2.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Desktop Home Toggle Highlight
  const desktopHomeToggle = document.querySelector('.desktop-nav-group .dropdown-toggle-btn');
  if (desktopHomeToggle) {
    if (isAnyHome) {
      desktopHomeToggle.classList.add('active');
    } else {
      desktopHomeToggle.classList.remove('active');
    }
  }

  // 2. Mobile Nav Links (About, Courses, Facilities, Contact, Dashboard)
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  mobileNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('?')[0].split('#')[0].toLowerCase();
    if (pageName === cleanHref) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 3. Mobile Accordion Home Toggle Highlight
  const mobileHomeToggle = document.querySelector('.mobile-accordion-toggle');
  if (mobileHomeToggle) {
    if (isAnyHome) {
      mobileHomeToggle.classList.add('active');
    } else {
      mobileHomeToggle.classList.remove('active');
    }
  }

  // 4. Mobile Sublinks Highlight (Home 1 vs Home 2)
  const mobileSubLinks = document.querySelectorAll('.mobile-sub-link');
  mobileSubLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const cleanHref = href.split('?')[0].split('#')[0].toLowerCase();
    if (isHome1 && cleanHref === 'index.html') {
      link.classList.add('active');
    } else if (isHome2 && cleanHref === 'home-2.html') {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}



/* ==========================================================================
   9. STUDENT PORTAL AUTHENTICATION & LOGIN TABS
   ========================================================================== */
function initAuthTabs() {
  const signinTabBtn = document.getElementById('tab-btn-signin');
  const registerTabBtn = document.getElementById('tab-btn-register');
  const signinForm = document.getElementById('form-signin');
  const registerForm = document.getElementById('form-register');

  if (!signinTabBtn || !registerTabBtn || !signinForm || !registerForm) return;

  const showSignIn = () => {
    signinTabBtn.classList.add('active', 'border-b-2', 'border-sky-600', 'text-sky-700', 'dark:text-sky-400', 'font-bold');
    signinTabBtn.classList.remove('text-slate-500', 'dark:text-slate-400', 'font-medium');

    registerTabBtn.classList.remove('active', 'border-b-2', 'border-sky-600', 'text-sky-700', 'dark:text-sky-400', 'font-bold');
    registerTabBtn.classList.add('text-slate-500', 'dark:text-slate-400', 'font-medium');

    signinForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  };

  const showRegister = () => {
    registerTabBtn.classList.add('active', 'border-b-2', 'border-sky-600', 'text-sky-700', 'dark:text-sky-400', 'font-bold');
    registerTabBtn.classList.remove('text-slate-500', 'dark:text-slate-400', 'font-medium');

    signinTabBtn.classList.remove('active', 'border-b-2', 'border-sky-600', 'text-sky-700', 'dark:text-sky-400', 'font-bold');
    signinTabBtn.classList.add('text-slate-500', 'dark:text-slate-400', 'font-medium');

    registerForm.classList.remove('hidden');
    signinForm.classList.add('hidden');
  };

  signinTabBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showSignIn();
  });

  registerTabBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showRegister();
  });

  // Password visibility eye icon toggle
  const togglePassBtn = document.getElementById('toggle-password-btn');
  const passwordInput = document.getElementById('auth-password');
  if (togglePassBtn && passwordInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPass = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPass ? 'text' : 'password');
    });
  }

  // Quick One-Click Demo Sign In Handler
  const demoSignInBtn = document.getElementById('demo-signin-btn');
  if (demoSignInBtn) {
    demoSignInBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'dashboard.html';
    });
  }
}

/* ==========================================================================
   10. STUDENT DASHBOARD SIDEBAR & DYNAMIC TAB SYSTEM
   ========================================================================== */
function initDashboardTabs() {
  const sidebarButtons = document.querySelectorAll('.dashboard-nav-btn');
  const tabPanels = document.querySelectorAll('.dashboard-tab-panel');
  const mobileToggleBtn = document.getElementById('dashboard-menu-toggle');
  const closeSidebarBtn = document.getElementById('dashboard-sidebar-close');
  const sidebar = document.getElementById('dashboard-sidebar');
  const backdrop = document.getElementById('dashboard-backdrop');

  if (sidebarButtons.length === 0 || tabPanels.length === 0) return;

  let backdropHideTimer;
  const closeSidebar = () => {
    if (!sidebar || !backdrop) return;
    sidebar.classList.remove('open');
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.remove('open');
    if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    window.clearTimeout(backdropHideTimer);
    backdropHideTimer = window.setTimeout(() => {
      if (!sidebar.classList.contains('open')) {
        backdrop.classList.add('hidden');
      }
    }, 250);
  };

  const openSidebar = () => {
    if (!sidebar || !backdrop) return;
    window.clearTimeout(backdropHideTimer);
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('open');
    backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (mobileToggleBtn) mobileToggleBtn.setAttribute('aria-expanded', 'true');
    window.requestAnimationFrame(() => {
      backdrop.classList.add('open');
    });
  };

  sidebarButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTabId = btn.getAttribute('data-tab');
      if (!targetTabId) return;

      // Update button active state
      sidebarButtons.forEach(b => {
        b.classList.remove('active', 'bg-sky-50', 'dark:bg-sky-950/70', 'text-sky-700', 'dark:text-sky-400', 'font-bold');
        b.classList.add('text-slate-700', 'dark:text-slate-300', 'font-medium', 'hover:bg-slate-100', 'dark:hover:bg-neutral-800');
      });

      btn.classList.add('active', 'bg-sky-50', 'dark:bg-sky-950/70', 'text-sky-700', 'dark:text-sky-400', 'font-bold');
      btn.classList.remove('text-slate-700', 'dark:text-slate-300', 'font-medium', 'hover:bg-slate-100', 'dark:hover:bg-neutral-800');

      // Show target panel and hide other panels
      tabPanels.forEach(panel => {
        if (panel.id === targetTabId) {
          panel.classList.remove('hidden');
          // Smooth fade in
          panel.style.opacity = '0';
          setTimeout(() => { panel.style.opacity = '1'; }, 50);
        } else {
          panel.classList.add('hidden');
        }
      });

      // On mobile, close sidebar after clicking a tab
      if (sidebar && backdrop && window.innerWidth < 1024) {
        closeSidebar();
      }
    });
  });

  // Mobile Dashboard Sidebar Toggle
  if (mobileToggleBtn && sidebar && backdrop) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = sidebar.classList.contains('open');
      if (isOpen) closeSidebar();
      else openSidebar();
    });

    if (closeSidebarBtn) {
      closeSidebarBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeSidebar();
      });
    }

    backdrop.addEventListener('click', (e) => {
      e.preventDefault();
      closeSidebar();
    });

    // Prevent clicks inside sidebar from bubbling to backdrop
    sidebar.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar();
        mobileToggleBtn.focus();
      }
    });
  }
}
