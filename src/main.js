import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio initialized');
  
  // Add some simple scroll reveal effects if needed
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
        entry.target.classList.remove('opacity-0', 'translate-y-10');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
    observer.observe(el);
  });
});
