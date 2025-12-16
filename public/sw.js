// public/sw.js
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
});

self.addEventListener('fetch', (event) => {
  // This dummy fetch handler satisfies the PWA requirement
  // In a real app, you would cache files here
});