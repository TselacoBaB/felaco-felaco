
// Enhanced Service Worker for PWA functionality
const CACHE_NAME = 'felaco-cache-v4';
const OFFLINE_URL = '/offline.html';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  '/lovable-uploads/c57b3ac2-d55c-4fbe-869f-d3207d6b9bde.png',
  '/src/index.css'
];

// Dynamic caching strategy with stale-while-revalidate pattern
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Don't cache API calls, dynamic data, or non-GET requests
    if (!request.url.includes('/api/') && 
        !request.url.includes('/storage/') &&
        request.method === 'GET') {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache if network fails
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If the request is for a page (HTML), serve the offline page
    if (request.headers.get('Accept').includes('text/html')) {
      return cache.match(OFFLINE_URL);
    }
    
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

// Precache critical assets during installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Force activation
  );
});

// Cache and return requests with improved strategy
self.addEventListener('fetch', event => {
  // Skip cross-origin requests and API calls
  if (event.request.mode === 'navigate' || 
      (event.request.method === 'GET' && 
       event.request.headers.get('Accept').includes('text/html'))) {
    // For navigation requests, use stale-while-revalidate
    event.respondWith(staleWhileRevalidate(event.request));
  } else if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
    return; // Don't cache API requests or non-GET methods
  } else {
    // For all other requests, use stale-while-revalidate too
    event.respondWith(staleWhileRevalidate(event.request));
  }
});

// Update service worker and clean old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Enhanced push notification handling with action buttons
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Felaco Notification';
  const options = {
    body: data.body || 'New activity on your account',
    icon: '/lovable-uploads/c57b3ac2-d55c-4fbe-869f-d3207d6b9bde.png',
    badge: '/lovable-uploads/c57b3ac2-d55c-4fbe-869f-d3207d6b9bde.png',
    image: data.image,
    vibrate: [100, 50, 100, 50, 100],
    data: {
      url: data.url || '/',
      action: data.action || 'default',
      timestamp: data.timestamp || new Date().getTime()
    },
    actions: [
      {
        action: 'view',
        title: 'View'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    tag: data.tag || 'default', // For notification grouping
    renotify: data.renotify || false,
    requireInteraction: data.requireInteraction || false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click with improved action routing
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Handle action buttons
  if (event.action === 'view') {
    clients.openWindow(event.notification.data.url);
    return;
  } else if (event.action === 'dismiss') {
    return; // Just close the notification
  }
  
  // Default action - open the appropriate URL
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (const client of windowClients) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        // If not, open a new window
        return clients.openWindow(event.notification.data.url);
      })
  );
});

// Handle background sync for offline posts/likes
self.addEventListener('sync', event => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  } else if (event.tag === 'sync-interactions') {
    event.waitUntil(syncInteractions());
  } else if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Background sync functions
async function syncPosts() {
  const offlinePosts = await getOfflineData('offlinePosts');
  if (offlinePosts.length > 0) {
    // Attempt to sync each offline post
    await Promise.all(offlinePosts.map(async (post) => {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(post)
        });
        
        if (response.ok) {
          // Remove from offline store if successful
          await removeOfflineData('offlinePosts', post.id);
        }
      } catch (error) {
        console.error('Failed to sync post:', error);
      }
    }));
  }
}

async function syncInteractions() {
  const offlineInteractions = await getOfflineData('offlineInteractions');
  if (offlineInteractions.length > 0) {
    // Attempt to sync each offline interaction
    await Promise.all(offlineInteractions.map(async (interaction) => {
      try {
        const response = await fetch(`/api/interactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(interaction)
        });
        
        if (response.ok) {
          // Remove from offline store if successful
          await removeOfflineData('offlineInteractions', interaction.id);
        }
      } catch (error) {
        console.error('Failed to sync interaction:', error);
      }
    }));
  }
}

async function syncMessages() {
  const offlineMessages = await getOfflineData('offlineMessages');
  if (offlineMessages.length > 0) {
    // Attempt to sync each offline message
    await Promise.all(offlineMessages.map(async (message) => {
      try {
        const response = await fetch(`/api/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        });
        
        if (response.ok) {
          // Remove from offline store if successful
          await removeOfflineData('offlineMessages', message.id);
        }
      } catch (error) {
        console.error('Failed to sync message:', error);
      }
    }));
  }
}

// Helper functions for managing offline data
async function getOfflineData(storeName) {
  return new Promise((resolve) => {
    const request = indexedDB.open('felacoOfflineDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      
      const items = [];
      store.openCursor().onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          items.push(cursor.value);
          cursor.continue();
        } else {
          resolve(items);
        }
      };
    };
    
    request.onerror = () => {
      console.error('Error opening offline database');
      resolve([]);
    };
  });
}

async function removeOfflineData(storeName, id) {
  return new Promise((resolve) => {
    const request = indexedDB.open('felacoOfflineDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => {
        resolve();
      };
      
      deleteRequest.onerror = () => {
        console.error('Error deleting item from offline store');
        resolve();
      };
    };
    
    request.onerror = () => {
      console.error('Error opening offline database');
      resolve();
    };
  });
}
