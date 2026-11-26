import './style.css';
import { translations } from './data/translations.js';

let currentLang = 'ko';

/**
 * Retrieve a nested translation value using a dot-separated key path.
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

/**
 * Apply the selected language across all marked DOM elements.
 */
function applyLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;

  currentLang = lang;
  document.documentElement.lang = lang;
  document.title = dict.meta.title;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const text = getNestedValue(dict, key);
    if (typeof text === 'string') {
      el.textContent = text;
    }
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria-label');
    const label = getNestedValue(dict, key);
    if (typeof label === 'string') {
      el.setAttribute('aria-label', label);
    }
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const isSelected = btn.getAttribute('data-lang') === lang;
    btn.classList.toggle('is-active', isSelected);
    btn.setAttribute('aria-pressed', String(isSelected));
  });

  const feedback = document.getElementById('copy-feedback');
  if (feedback) {
    feedback.textContent = '';
  }
}

/**
 * Set up language switcher buttons.
 */
function initLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetLang = btn.getAttribute('data-lang');
      if (targetLang && targetLang !== currentLang) {
        applyLanguage(targetLang);
      }
    });
  });
}

/**
 * Set up responsive mobile navigation drawer.
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggleBtn || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('is-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', translations[currentLang].a11y.menuToggle);
  };

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.setAttribute(
      'aria-label',
      isOpen ? translations[currentLang].a11y.menuClose : translations[currentLang].a11y.menuToggle,
    );
  });

  nav.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      closeMenu();
    }
  });
}

/**
 * Reveal sections and cards smoothly on scroll.
 */
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
  );

  targets.forEach((el) => observer.observe(el));
}

/**
 * Set up activity template modal to show editable fields and upcoming notes.
 */
function initActivityModal() {
  const modal = document.getElementById('activity-modal');
  const statusEl = document.getElementById('modal-status');
  const titleEl = document.getElementById('modal-title');
  const descEl = document.getElementById('modal-desc');
  const categoryEl = document.getElementById('modal-category');
  const recordEl = document.getElementById('modal-record');
  const linkEl = document.getElementById('modal-link');
  const closeBtn = document.getElementById('modal-close');
  const confirmBtn = document.getElementById('modal-confirm');

  if (!modal) return;

  let lastFocusedEl = null;

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedEl instanceof HTMLElement) {
      lastFocusedEl.focus();
    }
  };

  const openModal = (activityKey, triggerEl) => {
    const activity = translations[currentLang]?.activityDetails?.[activityKey];
    if (!activity) return;

    lastFocusedEl = triggerEl;
    statusEl.textContent = activity.status;
    statusEl.className = `status-badge ${
      activityKey === 'a5' ? 'status-goal' : 'status-pending'
    }`;
    titleEl.textContent = activity.title;
    descEl.textContent = activity.desc;
    categoryEl.textContent = activity.category;
    recordEl.textContent = activity.record;
    linkEl.textContent = activity.link;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  };

  document.querySelectorAll('.btn-detail').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-activity');
      if (key) openModal(key, btn);
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  confirmBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
}

/**
 * Set up email clipboard copy helper alongside mailto link.
 */
function initEmailCopy() {
  const copyBtn = document.getElementById('copy-email-btn');
  const feedback = document.getElementById('copy-feedback');
  if (!copyBtn || !feedback) return;

  copyBtn.addEventListener('click', async () => {
    const email = copyBtn.getAttribute('data-email') || 'Hongminhgt@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      feedback.textContent = translations[currentLang].contact.copiedFeedback;
    } catch {
      feedback.textContent = translations[currentLang].contact.copyFallback;
    }
  });
}

function init() {
  applyLanguage('ko');
  initLanguageSwitcher();
  initMobileMenu();
  initScrollReveal();
  initActivityModal();
  initEmailCopy();
}

init();
