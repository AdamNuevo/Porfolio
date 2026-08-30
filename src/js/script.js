document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initStickyHeader();
  initMobileMenu();
  initProjectFilters();
  initActiveNavSpy();
  initCommandPalette();
  initEmailCopy();
  initKeyboardShortcuts();
});

/* Theme toggle */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const currentTheme = localStorage.getItem('adam_portfolio_theme') || 'light';
  
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcons(currentTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('adam_portfolio_theme', newTheme);
      updateThemeIcons(newTheme);
      showToast(`Theme switched to ${newTheme} mode`);
    });
  });
}

function updateThemeIcons(theme) {
  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    } else {
      icon.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    }
  });
}

/* Sticky header on scroll */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* Mobile menu */
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Category filter */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  if (!filterBtns.length || !projectItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category')?.toLowerCase().split(' ') || [];
        if (category === 'all' || itemCategories.includes(category.toLowerCase())) {
          item.style.display = 'grid';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
        }
      });
    });
  });
}

/* Active navigation spy */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { passive: true });
}

/* Command palette navigator */
function initCommandPalette() {
  const backdrop = document.getElementById('cmdPalette');
  const openBtn = document.getElementById('cmdOpenBtn');
  const searchInput = document.getElementById('cmdSearchInput');
  const cmdItems = document.querySelectorAll('.cmd-item');

  if (!backdrop) return;

  function openPalette() {
    backdrop.classList.add('active');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
      filterCmdList('');
    }
  }

  function closePalette() {
    backdrop.classList.remove('active');
  }

  if (openBtn) {
    openBtn.addEventListener('click', openPalette);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closePalette();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      filterCmdList(e.target.value.toLowerCase().trim());
    });
  }

  function filterCmdList(query) {
    cmdItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!query || text.includes(query)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  cmdItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      handleAction(action);
      closePalette();
    });
  });

  window.openCommandPalette = openPalette;
  window.closeCommandPalette = closePalette;
}

function handleAction(action) {
  if (!action) return;

  if (action.startsWith('#')) {
    const target = document.querySelector(action);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  } else if (action === 'github') {
    window.open('https://github.com/Blanknetework', '_blank');
  } else if (action === 'linkedin') {
    window.open('https://linkedin.com/in/adamnuevo73', '_blank');
  } else if (action === 'cv') {
    const link = document.createElement('a');
    link.href = 'assets/cv/Adam_Nuevo_OJT_CV.pdf.pdf';
    link.download = 'Adam_Nuevo_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloading Adam Nuevo CV...');
  } else if (action === 'email') {
    copyEmail();
  } else if (action === 'theme') {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('adam_portfolio_theme', newTheme);
    updateThemeIcons(newTheme);
    showToast(`Theme switched to ${newTheme} mode`);
  }
}

/* Keyboard shortcuts */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement?.tagName.toLowerCase();
    const isInputActive = activeTag === 'input' || activeTag === 'textarea';

    const backdrop = document.getElementById('cmdPalette');
    const isPaletteOpen = backdrop?.classList.contains('active');

    if (e.key === 'Escape' && isPaletteOpen) {
      backdrop.classList.remove('active');
      return;
    }

    if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) && !isInputActive) {
      e.preventDefault();
      if (isPaletteOpen) {
        backdrop.classList.remove('active');
      } else {
        window.openCommandPalette?.();
      }
      return;
    }

    if (!isInputActive && !isPaletteOpen && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const key = e.key.toLowerCase();
      if (key === 'p') {
        document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
      } else if (key === 'j') {
        document.querySelector('#journey')?.scrollIntoView({ behavior: 'smooth' });
      } else if (key === 'a') {
        document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
      } else if (key === 's') {
        document.querySelector('#skills')?.scrollIntoView({ behavior: 'smooth' });
      } else if (key === 'n') {
        document.querySelector('#now')?.scrollIntoView({ behavior: 'smooth' });
      } else if (key === 'c') {
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
      } else if (key === 'v') {
        handleAction('cv');
      } else if (key === 'g') {
        window.open('https://github.com/Blanknetework', '_blank');
      }
    }
  });
}

/* Clipboard helper */
function initEmailCopy() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      copyEmail();
    });
  });
}

function copyEmail() {
  const email = 'adamnuevo28@gmail.com';
  navigator.clipboard.writeText(email).then(() => {
    showToast(`Copied to clipboard: ${email}`);
  }).catch(() => {
    showToast(`Email: ${email}`);
  });
}

function showToast(message) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}