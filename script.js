// Portfolio interactive behavior: mobile menu, smooth scrolling, counters, reveal animations, and ripple effects.
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const backToTop = document.getElementById('backToTop');
const scrollProgressBar = document.getElementById('scrollProgressBar');
const typingText = document.getElementById('typingText');
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const rippleButtons = document.querySelectorAll('.ripple-btn');
const stats = document.querySelectorAll('[data-target]');
const skillCards = document.querySelectorAll('.skill-card');
const revealElements = document.querySelectorAll('.fade-in, .slide-up');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const footerYear = document.getElementById('footerYear');

const typingPhrases = [
  'responsive web experiences',
  'machine learning systems',
  'clean full-stack solutions',
  'data-driven products',
  'future-ready software',
];

let typingIndex = 0;
let characterIndex = 0;
let isDeleting = false;
let typingDelay = 70;

function toggleMobileMenu() {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('hidden');
}

function closeMobileMenu() {
  navToggle.setAttribute('aria-expanded', 'false');
  navMenu.classList.add('hidden');
}

function smoothScroll(event) {
  const targetHref = event.currentTarget.getAttribute('href');
  if (!targetHref || !targetHref.startsWith('#')) return;
  const targetElement = document.querySelector(targetHref);
  if (targetElement) {
    event.preventDefault();
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMobileMenu();
  }
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgressBar.style.width = `${progress}%`;
}

function updateActiveNav() {
  const fromTop = window.scrollY + 150;
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;

    if (fromTop >= sectionTop && fromTop < sectionTop + sectionHeight) {
      navLinks.forEach((navLink) => navLink.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

function toggleBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startTypingEffect() {
  const currentPhrase = typingPhrases[typingIndex % typingPhrases.length];
  if (isDeleting) {
    characterIndex -= 1;
    typingText.textContent = currentPhrase.substring(0, characterIndex);

    if (characterIndex <= 0) {
      isDeleting = false;
      typingIndex += 1;
      setTimeout(startTypingEffect, 300);
      return;
    }
  } else {
    characterIndex += 1;
    typingText.textContent = currentPhrase.substring(0, characterIndex);

    if (characterIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(startTypingEffect, 1800);
      return;
    }
  }

  setTimeout(startTypingEffect, isDeleting ? typingDelay / 2 : typingDelay);
}

function animateCounters() {
  stats.forEach((stat) => {
    const target = Number(stat.dataset.target);
    const duration = 1500;
    const step = Math.max(1, Math.ceil(target / (duration / 25)));
    let value = 0;

    const counter = setInterval(() => {
      value += step;
      if (value >= target) {
        stat.textContent = target;
        clearInterval(counter);
        return;
      }
      stat.textContent = value;
    }, 25);
  });
}

function revealOnScroll() {
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  revealElements.forEach((element) => revealObserver.observe(element));
}

function observeStats() {
  if (!stats.length) return;

  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounters();
      observer.disconnect();
    });
  }, { threshold: 0.4 });

  statObserver.observe(stats[0]);
}

function animateSkillBars() {
  if (!skillCards.length) return;

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const progressBar = entry.target.querySelector('.skill-progress');
      const targetLevel = entry.target.dataset.level;
      if (progressBar && targetLevel) {
        progressBar.style.width = `${targetLevel}%`;
      }

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  skillCards.forEach((card) => skillObserver.observe(card));
}

function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;
  const rect = button.getBoundingClientRect();

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - rect.left - radius}px`;
  circle.style.top = `${event.clientY - rect.top - radius}px`;
  circle.className = 'ripple-effect';

  const existingRipple = button.querySelector('.ripple-effect');
  if (existingRipple) existingRipple.remove();
  button.appendChild(circle);
}

function initRippleButtons() {
  rippleButtons.forEach((button) => {
    button.addEventListener('click', createRipple);
  });
}

function validateInput(input) {
  if (!input.value.trim()) {
    return 'This field is required.';
  }

  if (input.type === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(input.value.trim())) {
      return 'Please enter a valid email address.';
    }
  }

  return '';
}

function animatePlaceholder(field, examples) {
  if (!field) return;

  let exampleIndex = 0;
  let currentText = '';
  let isDeleting = false;

  const tick = () => {
    const currentExample = examples[exampleIndex];

    if (!isDeleting) {
      currentText = currentExample.slice(0, currentText.length + 1);
      field.placeholder = currentText;

      if (currentText === currentExample) {
        isDeleting = true;
        setTimeout(tick, 1400);
        return;
      }
    } else {
      currentText = currentExample.slice(0, currentText.length - 1);
      field.placeholder = currentText;

      if (currentText === '') {
        isDeleting = false;
        exampleIndex = (exampleIndex + 1) % examples.length;
      }
    }

    setTimeout(tick, isDeleting ? 70 : 90);
  };

  tick();
}

function animateContactPlaceholders() {
  const emailInput = document.getElementById('formEmail');
  const subjectInput = document.getElementById('formSubject');
  const messageInput = document.getElementById('formMessage');

  if (emailInput) {
    animatePlaceholder(emailInput, ['yourname@gmail.com', 'yourname@hotmail.com', 'yourname@outlook.com']);
  }

  if (subjectInput) {
    animatePlaceholder(subjectInput, ['Project inquiry', 'Website redesign', 'Mobile app idea']);
  }

  if (messageInput) {
    animatePlaceholder(messageInput, ['Tell me about your project...', 'I need help with a landing page.', 'I want to build a modern web app.']);
  }
}

function initContactForm() {
  if (!contactForm) return;

  const fields = contactForm.querySelectorAll('input, textarea');
  const errorMessages = contactForm.querySelectorAll('.form-error');
  const whatsappNumber = contactForm.dataset.whatsappNumber?.trim();

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let formValid = true;
    fields.forEach((field, index) => {
      const error = validateInput(field);
      const messageElement = errorMessages[index];
      if (messageElement) {
        messageElement.textContent = error;
        messageElement.classList.toggle('hidden', !error);
      }
      if (error) {
        formValid = false;
      }
    });

    if (!formValid) {
      formSuccess.classList.add('hidden');
      return;
    }

    const formData = {
      name: contactForm.querySelector('[name="name"]').value.trim(),
      email: contactForm.querySelector('[name="email"]').value.trim(),
      subject: contactForm.querySelector('[name="subject"]').value.trim(),
      message: contactForm.querySelector('[name="message"]').value.trim(),
    };

    contactForm.reset();
    errorMessages.forEach((messageElement) => {
      messageElement.textContent = '';
      messageElement.classList.add('hidden');
    });

    const hasPlaceholderNumber = !whatsappNumber || /x|your|phone/i.test(whatsappNumber);
    if (hasPlaceholderNumber) {
      formSuccess.textContent = 'Please replace the placeholder phone number in the form with your real WhatsApp number.';
      formSuccess.classList.remove('hidden');
      return;
    }

    const encodedText = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\n${formData.message}`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedText}`;
    const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    if (!newWindow) {
      window.location.href = whatsappUrl;
    }

    formSuccess.textContent = 'Opening WhatsApp with your message...';
    formSuccess.classList.remove('hidden');

    setTimeout(() => {
      formSuccess.classList.add('hidden');
    }, 5000);
  });
}

function setFooterYear() {
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
}

function initEventListeners() {
  if (navToggle) navToggle.addEventListener('click', toggleMobileMenu);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', smoothScroll);
  });

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateActiveNav();
    toggleBackToTop();
  });

  if (backToTop) backToTop.addEventListener('click', scrollToTop);
}

function init() {
  startTypingEffect();
  revealOnScroll();
  observeStats();
  animateSkillBars();
  initRippleButtons();
  animateContactPlaceholders();
  initContactForm();
  initEventListeners();
  updateScrollProgress();
  updateActiveNav();
  setFooterYear();
}

document.addEventListener('DOMContentLoaded', init);
