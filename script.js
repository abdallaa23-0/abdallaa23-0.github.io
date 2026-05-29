/* ============================================================
   script.js — Portfolio Interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. CURSOR GLOW
  ---------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');

  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
  });

  /* ----------------------------------------------------------
     2. NAV — shrink on scroll & active section highlight
  ---------------------------------------------------------- */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Shrink nav
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link
    let currentSection = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ----------------------------------------------------------
     3. MOBILE NAV TOGGLE
  ---------------------------------------------------------- */
  const navToggle   = document.getElementById('navToggle');
  const navLinkList = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navLinkList.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinkList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinkList.classList.remove('open');
    });
  });

  /* ----------------------------------------------------------
     4. SCROLL REVEAL
     Uses IntersectionObserver to fade-up elements as they
     enter the viewport.
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     5. COUNTER ANIMATION
     Counts up the hero stat numbers when they appear.
  ---------------------------------------------------------- */
  function animateCounter(el, target, duration = 1500) {
    const start     = performance.now();
    const startVal  = 0;

    function update(timestamp) {
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(startVal + eased * (target - startVal));
      el.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll('.stat-num[data-target]');
  let countersStarted = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          statNums.forEach((el) => {
            const target = parseInt(el.getAttribute('data-target'), 10);
            animateCounter(el, target);
          });
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ----------------------------------------------------------
     6. PROJECT CARD TILT (subtle 3D effect on hover)
  ---------------------------------------------------------- */
  const cards = document.querySelectorAll('.project-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4;  // max ±4deg
      const rotateY = ((x - cx) / cx) *  4;

      card.style.transform =
        `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'all 0.25s ease';
    });
  });

  /* ----------------------------------------------------------
     7. SMOOTH SCROLL (fallback for older browsers)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----------------------------------------------------------
     8. TYPING EFFECT on hero tag (optional nice touch)
     Replaces static text with a typed animation.
  ---------------------------------------------------------- */
  const heroTag  = document.querySelector('.hero-tag');
  const messages = [
    'CS AI Student · University of Alberta',
    'Open to internships & tech roles',
    'APEGA Science Olympics Gold Medalist',
  ];

  let msgIndex  = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimer;

  function typeEffect() {
    const current = messages[msgIndex];

    if (isDeleting) {
      heroTag.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      heroTag.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 50 : 90;

    if (!isDeleting && charIndex === current.length) {
      delay      = 2200; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      msgIndex   = (msgIndex + 1) % messages.length;
      delay      = 400;
    }

    typingTimer = setTimeout(typeEffect, delay);
  }

  // Start typing after initial fade-in delay
  setTimeout(typeEffect, 800);

});