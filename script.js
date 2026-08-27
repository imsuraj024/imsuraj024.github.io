document.addEventListener('DOMContentLoaded', () => {
  const boot = document.querySelector('.boot-screen');
  const progress = document.querySelector('.scan-progress span');
  const header = document.querySelector('.site-header');
  const links = document.querySelectorAll('a[href^="#"]');
  const revealItems = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-count]');
  const clock = document.querySelector('#clock');

  window.setTimeout(() => boot?.classList.add('done'), 1450);

  links.forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      const offset = header ? header.offsetHeight + 12 : 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));

  const animateCounter = element => {
    const target = Number(element.dataset.count);
    const decimal = element.dataset.decimal === 'true';
    const duration = 1100;
    const start = performance.now();
    const tick = now => {
      const progressValue = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progressValue, 3);
      element.textContent = decimal ? (target * eased).toFixed(1) : Math.round(target * eased);
      if (progressValue < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(counter => counterObserver.observe(counter));

  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const updateClock = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-IN', { hour12: false });
  };
  updateClock();
  window.setInterval(updateClock, 1000);
});
