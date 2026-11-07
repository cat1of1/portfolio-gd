const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const themeToggle = document.getElementById('theme-toggle');
const themeToggleLabel = themeToggle?.querySelector('.theme-toggle-label');
const metaThemeColor = document.querySelector('meta[name="theme-color"]');
const photoFrame = document.querySelector('.photo-frame');

let rotation = 0;
const rotateFrame = () => {
  if (!photoFrame) return;
  rotation += 180;
  photoFrame.style.setProperty('--rotation', `${rotation}deg`);
};

const syncPhotoWithTheme = (isDark, animateAlways = false) => {
  if (!photoFrame) return;
  const isShowingBack = Math.round(rotation / 180) % 2 !== 0;
  if (isDark !== isShowingBack) {
    rotation += 180;
  } else if (animateAlways) {
    rotation += 360;
  }
  photoFrame.style.setProperty('--rotation', `${rotation}deg`);
};

if (photoFrame) {
  photoFrame.classList.add('js-flip');

  photoFrame.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') {
      rotateFrame();
    }
  });

  photoFrame.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse') {
      rotateFrame();
    }
  });

  photoFrame.addEventListener('click', () => {
    rotateFrame();
  });

  photoFrame.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      rotateFrame();
    }
  });
}

const applyTheme = (theme, shouldFlipPhoto = false) => {
  const isDark = theme === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
  }
  if (themeToggleLabel) {
    themeToggleLabel.textContent = isDark ? 'Light' : 'Dark';
  }
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', isDark ? '#4a232d' : '#fae8eb');
  }
  if (shouldFlipPhoto) {
    syncPhotoWithTheme(isDark, true);
  }
};

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  applyTheme(savedTheme, false);
  syncPhotoWithTheme(savedTheme === 'dark', false);
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme, true);
  localStorage.setItem('theme', nextTheme);
});

menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});

siteNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  });
});

document.querySelectorAll('.filter-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    document.querySelectorAll('.project-card').forEach((card) => {
      card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section-heading, .intro-grid, .project-card, .contact-section').forEach((element) => {
  element.classList.add('reveal');
  revealObserver.observe(element);
});

document.getElementById('year').textContent = new Date().getFullYear();
