export function initScrollSpy() {
  const navLinks = document.querySelectorAll('#navLinks a');
  const sectionIds = ['afisha', 'menu', 'delivery', 'how'];

  function updateActiveLink() {
    if (!navLinks.length) return;
    let currentTarget = 'top';
    const scrollPosition = window.scrollY;
    const afisha = document.getElementById('afisha');
    if (afisha && scrollPosition < afisha.offsetTop - 200) currentTarget = 'top';
    else if ((window.innerHeight + scrollPosition) >= document.body.offsetHeight - 50) currentTarget = 'contacts';
    else {
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.getBoundingClientRect().top <= 250) { currentTarget = sectionIds[i]; break; }
      }
    }
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.target === currentTarget));
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);
  updateActiveLink();
}