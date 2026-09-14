import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function init() {
  const roleCards = Array.from(document.querySelectorAll('#experience .role-card'));
  const eduCards = Array.from(document.querySelectorAll('#education .role-card'));
  const skillCards = Array.from(document.querySelectorAll('.skills-card'));
  const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
  const logoWalk = document.getElementById('logoWalk');
  const logoWalkTrack = document.getElementById('logoWalkTrack');

  let activeTab = 'all';
  let logoBadges = [];

  // ---------------------------------------------------------------
  // Reveal-on-scroll
  // ---------------------------------------------------------------
  gsap.utils.toArray('.reveal-up').forEach((el) => {
    if (prefersReducedMotion) return;
    gsap.fromTo(
      el,
      { y: 36, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // ---------------------------------------------------------------
  // Logo walk: build badges from experience role cards
  // ---------------------------------------------------------------
  function buildLogoWalk() {
    logoWalkTrack.innerHTML = '';
    logoBadges = roleCards.map((card) => {
      const monogram = card.querySelector('.role-monogram').textContent.trim();
      const company = card.querySelector('.role-company').textContent.split('—')[0].trim();

      const btn = document.createElement('button');
      btn.className = 'logo-badge';
      btn.type = 'button';
      btn.innerHTML = `<span class="logo-badge-circle">${monogram}</span><span class="logo-badge-label">${company}</span>`;
      btn.addEventListener('click', () => {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      logoWalkTrack.appendChild(btn);
      return { card, btn };
    });
  }

  buildLogoWalk();

  ScrollTrigger.create({
    trigger: '#experience',
    start: 'top top+=140',
    end: 'bottom center',
    onEnter: () => logoWalk.classList.add('is-visible'),
    onLeave: () => logoWalk.classList.remove('is-visible'),
    onEnterBack: () => logoWalk.classList.add('is-visible'),
    onLeaveBack: () => logoWalk.classList.remove('is-visible'),
  });

  logoBadges.forEach(({ card, btn }) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) {
          logoBadges.forEach(({ btn: b }) => b.classList.remove('is-active'));
          btn.classList.add('is-active');
        }
      },
    });
  });

  // ---------------------------------------------------------------
  // Tab filtering: All / Consulting / Gaming
  // ---------------------------------------------------------------
  function cardMatchesTab(card, tab) {
    if (tab === 'all') return true;
    const tags = (card.dataset.tags || '').split(' ');
    return tags.includes(tab);
  }

  function applyLensVisibility(card, tab) {
    const groups = new Map();
    card.querySelectorAll('[data-lens]').forEach((el) => {
      const key = el.tagName;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(el);
    });

    groups.forEach((els) => {
      const lenses = new Set(els.map((el) => el.dataset.lens));
      const target = tab !== 'all' ? tab : lenses.has('consulting') ? 'consulting' : els[0].dataset.lens;
      els.forEach((el) => {
        el.classList.toggle('is-lens-hidden', el.dataset.lens !== target);
      });
    });
  }

  function setTab(tab) {
    activeTab = tab;

    tabButtons.forEach((btn) => {
      const isActive = btn.dataset.tab === tab;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    [...roleCards, ...eduCards].forEach((card) => {
      const matches = cardMatchesTab(card, tab);
      card.classList.toggle('is-hidden', !matches);
      if (matches) applyLensVisibility(card, tab);
    });

    skillCards.forEach((card) => {
      card.classList.toggle('is-hidden', !cardMatchesTab(card, tab));
    });

    logoBadges.forEach(({ card, btn }) => {
      btn.style.display = card.classList.contains('is-hidden') ? 'none' : 'flex';
    });

    ScrollTrigger.refresh();
  }

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => setTab(btn.dataset.tab));
  });

  setTab('all');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
