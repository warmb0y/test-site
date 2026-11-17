let currentStoryIndex = -1;
let currentSlideIndex = 0;
let progressRaf = null;
let progressStartTime = 0;
let progressElapsed = 0;
let isPaused = false;
let storyDuration = 5000;

window.openStory = function(index) {
  currentStoryIndex = index;
  currentSlideIndex = 0;
  const ev = window.eventsData[index];
  const viewer = document.getElementById('storyViewer');
  
  document.getElementById('storyTag').textContent = ev.tag;
  document.getElementById('storyTitle').textContent = ev.title;
  document.getElementById('storyDesc').textContent = ev.desc;
  
  document.getElementById('storyBookBtn').onclick = () => { closeStory(); openBooking(ev.date); };

  document.getElementById('storyProgress').innerHTML = ev.media.map((_, i) => 
    `<div class="story-progress-seg"><div class="story-progress-fill" data-idx="${i}"></div></div>`
  ).join('');

  document.getElementById('storySlides').innerHTML = ev.media.map((m, i) => {
    if (m.type === 'image') {
      return `<div class="story-slide ${i === 0 ? 'active' : ''}" data-idx="${i}"><img src="${m.src}"></div>`;
    }
    return `<div class="story-slide ${i === 0 ? 'active' : ''}" data-idx="${i}"><video src="${m.src}" ${m.poster ? `poster="${m.poster}"` : ''} muted playsinline autoplay loop></video></div>`;
  }).join('');

  viewer.classList.add('open');
  document.body.style.overflow = 'hidden';
  
  startSlideProgress();
};

function startSlideProgress() {
  stopSlideProgress();
  const ev = window.eventsData[currentStoryIndex];
  const slide = ev.media[currentSlideIndex];
  const progressFill = document.querySelector(`.story-progress-fill[data-idx="${currentSlideIndex}"]`);
  
  document.querySelectorAll('.story-progress-fill').forEach((el, i) => {
    el.style.width = i < currentSlideIndex ? '100%' : '0%';
  });

  if (slide.type === 'video') {
    const vid = document.querySelector(`.story-slide[data-idx="${currentSlideIndex}"] video`);
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch(()=>{});
      storyDuration = vid.duration ? vid.duration * 1000 : 10000;
    }
  } else {
    storyDuration = 5000;
  }

  progressStartTime = performance.now() - progressElapsed;

  function tick(now) {
    if (!isPaused) {
      progressElapsed = now - progressStartTime;
      const pct = Math.min(100, (progressElapsed / storyDuration) * 100);
      if (progressFill) progressFill.style.width = pct + '%';
      
      if (progressElapsed >= storyDuration) {
        stopSlideProgress();
        nextSlide();
        return;
      }
    } else {
      progressStartTime = now - progressElapsed; 
    }
    progressRaf = requestAnimationFrame(tick);
  }
  progressRaf = requestAnimationFrame(tick);
}

function stopSlideProgress() {
  if (progressRaf) cancelAnimationFrame(progressRaf);
  progressRaf = null;
}

window.closeStory = function() {
  stopSlideProgress();
  document.getElementById('storyViewer').classList.remove('open');
  document.body.style.overflow = '';
  document.querySelectorAll('#storySlides video').forEach(v => v.pause());
  isPaused = false;
};

window.nextSlide = function() {
  progressElapsed = 0;
  const ev = window.eventsData[currentStoryIndex];
  if (currentSlideIndex < ev.media.length - 1) {
    document.querySelectorAll('.story-slide').forEach(s => s.classList.remove('active'));
    currentSlideIndex++;
    document.querySelector(`.story-slide[data-idx="${currentSlideIndex}"]`).classList.add('active');
    document.querySelectorAll('#storySlides video').forEach(v => v.pause());
    startSlideProgress();
  } else if (currentStoryIndex < window.eventsData.length - 1) {
    openStory(currentStoryIndex + 1);
  } else {
    closeStory();
  }
};

window.prevSlide = function() {
  progressElapsed = 0;
  if (currentSlideIndex > 0) {
    document.querySelectorAll('.story-slide').forEach(s => s.classList.remove('active'));
    currentSlideIndex--;
    document.querySelector(`.story-slide[data-idx="${currentSlideIndex}"]`).classList.add('active');
    document.querySelectorAll('#storySlides video').forEach(v => v.pause());
    startSlideProgress();
  } else if (currentStoryIndex > 0) {
    openStory(currentStoryIndex - 1);
    currentSlideIndex = window.eventsData[currentStoryIndex].media.length - 1;
    document.querySelectorAll('.story-slide').forEach(s => s.classList.remove('active'));
    document.querySelector(`.story-slide[data-idx="${currentSlideIndex}"]`).classList.add('active');
  }
};

// Пауза и свайпы
const storyInner = document.getElementById('storyViewerInner');
if (storyInner) {
  storyInner.addEventListener('mousedown', () => { isPaused = true; document.querySelectorAll('#storySlides video').forEach(v => v.pause()); });
  storyInner.addEventListener('mouseup', () => { isPaused = false; document.querySelectorAll('#storySlides video').forEach(v => v.play().catch(()=>{})); });
  storyInner.addEventListener('mouseleave', () => { isPaused = false; document.querySelectorAll('#storySlides video').forEach(v => v.play().catch(()=>{})); });

  let touchStartX = 0;
  storyInner.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    isPaused = true;
    document.querySelectorAll('#storySlides video').forEach(v => v.pause());
  }, {passive: true});

  storyInner.addEventListener('touchend', (e) => {
    isPaused = false;
    document.querySelectorAll('#storySlides video').forEach(v => v.play().catch(()=>{}));
    const touchEndX = e.changedTouches[0].screenX;
    if (touchEndX < touchStartX - 50) nextSlide();
    if (touchEndX > touchStartX + 50) prevSlide();
  }, {passive: true});
}