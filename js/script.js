// ===== Theme Toggle =====
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', savedTheme);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// ===== Hamburger Menu =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  // Ensure aria attributes are initialised
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', 'navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// ===== Navbar scroll effect =====
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ===== Active nav link =====
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
    a.setAttribute('aria-current', 'page');
  }
});

// ===== Scroll animations =====
const animEls = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

animEls.forEach(el => observer.observe(el));

// ===== Counter animation =====
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const val = Math.floor(progress * target);
    el.textContent = val + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target, parseInt(e.target.dataset.count));
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ===== Portfolio Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

// Make all portfolio items visible immediately on page load (bypass scroll observer)
portfolioItems.forEach(item => {
  item.classList.add('visible');
});

filterBtns.forEach(btn => {
  // Initialise aria-pressed
  btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');

  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
        item.classList.add('visible');
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

// ===== Portfolio item keyboard activation =====
portfolioItems.forEach(item => {
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      item.click();
    }
  });
});

// ===== Pre-fill Contact Form from URL Params (Career Applications) =====
const params = new URLSearchParams(window.location.search);
const jobParam = params.get('job');
if (jobParam && document.getElementById('contactForm')) {
  // Set dropdown to "Careers / Join the Team"
  const serviceSelect = document.getElementById('service');
  if (serviceSelect) serviceSelect.value = 'careers';

  // Pre-fill message with job title
  const messageField = document.getElementById('message');
  if (messageField) {
    messageField.value = `Hi, I'd like to apply for the ${decodeURIComponent(jobParam).replace(/\+/g, ' ')} position. Here's a bit about me:\n\n`;
    messageField.focus();
    // Move cursor to end
    const len = messageField.value.length;
    messageField.setSelectionRange(len, len);
  }

  // Show a banner at top of form indicating which role they're applying for
  const formWrap = document.querySelector('.contact-form');
  if (formWrap) {
    const banner = document.createElement('div');
    banner.style.cssText = 'background:rgba(37,99,235,0.1);border:1px solid rgba(37,99,235,0.3);border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:0.9rem;color:var(--primary);font-weight:600;';
    banner.textContent = `Applying for: ${decodeURIComponent(jobParam).replace(/\+/g, ' ')}`;
    formWrap.insertBefore(banner, formWrap.firstChild);
  }
}

// ===== Contact Form =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const fields = contactForm.querySelectorAll('[required]');
    fields.forEach(field => {
      const err = field.parentElement.querySelector('.form-error');
      if (!field.value.trim()) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        if (err) err.classList.add('visible');
        valid = false;
      } else {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        if (err) err.classList.remove('visible');
      }
    });

    // Email validation
    const emailField = contactForm.querySelector('#email');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error');
      emailField.setAttribute('aria-invalid', 'true');
      const err = emailField.parentElement.querySelector('.form-error');
      if (err) { err.textContent = 'Please enter a valid email.'; err.classList.add('visible'); }
      valid = false;
    }

    if (valid) {
      const submitBtn = contactForm.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        // Build a plain object from the form and send JSON to the serverless proxy.
        const formData = new FormData(contactForm);
        const payload = {};
        for (const [k, v] of formData.entries()) payload[k] = v;

        const response = await fetch(contactForm.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const text = await response.text();
        let data = null;
        try { data = JSON.parse(text); } catch (e) {
          // Non-JSON response from server
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
          alert('Server returned an unexpected response. Please try again later.');
          return;
        }

        if (response.status === 200 && data && data.success) {
          contactForm.style.display = 'none';
          const success = document.getElementById('formSuccess');
          if (success) success.classList.add('visible');
        } else {
          submitBtn.textContent = 'Send Message';
          submitBtn.disabled = false;
          const msg = (data && data.error) ? data.error : 'Something went wrong. Please try again or email us directly.';
          alert(msg);
        }
      } catch (err) {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        alert('Network error. Please check your connection and try again.');
      }
    } else {
      // Move focus to first invalid field
      const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }
  });

  // Live validation clear
  contactForm.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => {
      if (field.value.trim()) {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        const err = field.parentElement.querySelector('.form-error');
        if (err) err.classList.remove('visible');
      }
    });
  });
}

// ===== Portfolio Modal =====
const modal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalCloseBtn = document.getElementById('modalCloseBtn');

if (modal) {
  let lastFocusedItem = null;

  // Focusable elements inside the modal for focus trap
  function getFocusable() {
    return Array.from(modal.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }

  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => {
      lastFocusedItem = item;

      const title = item.dataset.title;
      const cat   = item.dataset.cat;
      const desc  = item.dataset.desc;
      const tags  = item.dataset.tags ? item.dataset.tags.split(',') : [];
      const bg    = item.dataset.bg;
      const thumbSvg = item.querySelector('.portfolio-thumb svg');

      const modalThumb = document.getElementById('modalThumb');
      modalThumb.style.background = bg;
      modalThumb.innerHTML = '';
      if (thumbSvg) {
        const iconClone = thumbSvg.cloneNode(true);
        iconClone.setAttribute('width', '100%');
        iconClone.setAttribute('height', '100%');
        modalThumb.appendChild(iconClone);
      }
      document.getElementById('modalCat').textContent = cat;
      document.getElementById('modalTitle').textContent = title;
      document.getElementById('modalDesc').textContent = desc;

      const tagsEl = document.getElementById('modalTags');
      tagsEl.innerHTML = tags.map(t => `<span class="modal-tag">${t.trim()}</span>`).join('');

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Move focus to the close button
      requestAnimationFrame(() => {
        if (modalClose) modalClose.focus();
      });
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    // Return focus to the card that opened the modal
    if (lastFocusedItem) lastFocusedItem.focus();
  }

  // Focus trap inside modal
  modal.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {
      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  });

  modalClose.addEventListener('click', closeModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
}
