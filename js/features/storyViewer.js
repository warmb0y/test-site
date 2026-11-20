import { events } from '../data/events.js';

let currentStoryIndex = -1;
let currentSlideIndex = 0;
let progressRaf = null;

export function openStory(index) {
  currentStoryIndex = index;
  currentSlideIndex = 0;
  const ev = events[index];
  const viewer = document.getElementById('storyViewer');
  const slides = document.getElementById('storySlides');
  const progress = document.getElementById('storyProgress');

  document.getElementById('storyTag').textContent = ev.tag;
  document.getElementById('storyTitle').textContent = ev.title;
  document.getElementById('storyDesc').textContent = ev.desc;
  document.getElementById('storyDateText').textContent = ev.date.split('-').reverse().join('.');
  document.getElementById('storyTimeText').textContent = ev.time;

  const bookBtn = document.getElementById('storyBookBtn');
  bookBtn.onclick = () => {
    const date = ev.date;
    closeStory();
    window.openBooking(date);
  };

  progress.innerHTML = ev.media.map((_, i) =>
    `<div class="story-progress-seg"><div class="story-progress-fill" data-idx="${i}"></div></div>`
  ).join('');

  slides.innerHTML = ev.media.map((m, i) => {
    if (m.type === 'image') {
      return `<div class="story-slide ${i === 0 ? 'active' : ''}" data-idx="${i}"><img src="${m.src}" alt="slide ${i+1}"></div>`;
    }
    return `<div class="story-slide ${i === 0 ? 'active' : ''}" data-idx="${i}"><video src="${m.src}" ${m.poster ? `poster="${m.poster}"` : ''} muted playsinline autoplay loop></video></div>`;
  }).join('');

  viewer.querySelectorAll('.story-nav').forEach(n => n.style.display = ev.media.length > 1 ? 'flex' : 'none');

  viewer.classList.add('open');
  document.body.style.overflow = 'hidden';
  startSlideProgress();
}

function startSlideProgress() {
  stopSlideProgress();
  const ev = events[currentStoryIndex];
  const slide = ev.media[currentSlideIndex];
  const progressFill = document.querySelector(`.story-progress-fill[data-idx="${currentSlideIndex}"]`);

  document.querySelectorAll('.story-progress-fill').forEach((el, i) => {
    el.style.width = i < currentSlideIndex ? '100%' : '0%';
  });

  const duration = slide.type === 'video' ? 8000 : 5000;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const pct = Math.min(100, (elapsed / duration) * 100);
    if (progressFill) progressFill.style.width = pct + '%';
    if (elapsed >= duration) { stopSlideProgress(); nextSlide(); return; }
    progressRaf = requestAnimationFrame(tick);
  }
  progressRaf = requestAnimationFrame(tick);
}

function stopSlideProgress() {
  if (progressRaf) { cancelAnimationFrame(progressRaf); progressRaf = null; }
}

export function closeStory() {
  stopSlideProgress();
  document.getElementById('storyViewer').classList.remove('open');
  document.body.style.overflow = '';
  document.querySelectorAll('#storySlides video').forEach(v => v.pause());
}

export function nextSlide() {
  const ev = events[currentStoryIndex];
  if (currentSlideIndex < ev.media.length - 1) {
    currentSlideIndex++;
    switchSlide();
  } else if (currentStoryIndex < events.length - 1) {
    openStory(currentStoryIndex + 1);
  } else {
    closeStory();
  }
}

export function prevSlide() {
  if (currentSlideIndex > 0) {
    currentSlideIndex--;
    switchSlide();
  }
}

function switchSlide() {
  const slides = document.querySelectorAll('#storySlides .story-slide');
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === currentSlideIndex);
    const vid = s.querySelector('video');
    if (vid) {
      if (i === currentSlideIndex) vid.play().catch(() => {});
      else vid.pause();
    }
  });
  startSlideProgress();
}