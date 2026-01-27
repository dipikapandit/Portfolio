
document.addEventListener('DOMContentLoaded', function() {
  // Animate timeline items in
  const items = document.querySelectorAll('.timeline__item');
  const lineFill = document.querySelector('.timeline__line-fill');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal items on intersection
  const itemObserver = new window.IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  items.forEach(item => itemObserver.observe(item));

  // Animate the vertical line fill
  if (lineFill && items.length) {
    const lastItem = items[items.length - 1];
    const lineObserver = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Batch all reads before writes to prevent layout thrashing
          requestAnimationFrame(() => {
            const lineRect = lineFill.parentElement.getBoundingClientRect();
            const lastRect = lastItem.getBoundingClientRect();
            const fillHeight = (lastRect.top + lastRect.height/2) - lineRect.top;
            
            // Then do the write in a separate frame
            requestAnimationFrame(() => {
              if (!prefersReducedMotion) {
                lineFill.style.height = fillHeight + 'px';
              } else {
                lineFill.style.height = '100%';
              }
            });
          });
        }
      });
    }, { threshold: 0.1 });
    lineObserver.observe(lastItem);
  }

  // Optionally: fill line as each item appears (progressive fill)
  if (lineFill && items.length && !prefersReducedMotion) {
    const fillStepObserver = new window.IntersectionObserver((entries) => {
      // Batch all reads first
      requestAnimationFrame(() => {
        const lineRect = lineFill.parentElement.getBoundingClientRect();
        let maxFill = 0;
        
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const itemRect = entry.target.getBoundingClientRect();
            const fill = (itemRect.top + itemRect.height/2) - lineRect.top;
            if (fill > maxFill) maxFill = fill;
          }
        });
        
        // Then do the write in a separate frame
        if (maxFill > 0) {
          requestAnimationFrame(() => {
            lineFill.style.height = maxFill + 'px';
          });
        }
      });
    }, { threshold: 0.5 });
    items.forEach(item => fillStepObserver.observe(item));
  }
});
