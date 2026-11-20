import { events, formatDate } from '../data/events.js';

export function renderStories(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = events.map((ev, i) => {
    const firstMedia = ev.media[0];
    const thumbContent = firstMedia.type === 'image'
      ? `<img src="${firstMedia.src}" alt="${ev.title}" loading="lazy">`
      : (firstMedia.poster ? `<img src="${firstMedia.poster}" alt="${ev.title}" loading="lazy">` : ev.emoji);
    return `
      <div class="story-item" onclick="openStory(${i})">
        <div class="story-ring">
          <div class="story-thumb">${thumbContent}</div>
        </div>
        <div class="story-label">${ev.title}</div>
        <div class="story-date-mini">${formatDate(ev.date)} · ${ev.time.split('–')[0].trim()}</div>
      </div>
    `;
  }).join('');
}