// service-worker.js - Formula Kite 2026 PWA

const CACHE_NAME = 'viana-2026-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/acesso.html',
    '/icon.png',
    '/image_11335c.png',
    '/manifest.json'
];

// 1. Instalação do Service Worker (Cache offline)
self.addEventListener('install', (event) => {
    console.log('[SW] Instalado.');
    self.skipWaiting(); // Ativa imediatamente
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).catch(err => console.log('[SW] Erro no cache:', err))
    );
});

// 2. Ativação (Limpa caches antigos)
self.addEventListener('activate', (event) => {
    console.log('[SW] Ativado.');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Fetch (Modo Offline)
self.addEventListener('fetch', (event) => {
    if (!event.request.url.startsWith(self.location.origin)) return;
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});

// ---------------------------------------------------------
// 4. PUSH NOTIFICATIONS REAIS (Recebe do Servidor)
// ---------------------------------------------------------
self.addEventListener('push', (event) => {
    console.log('[SW] Mensagem Push Real Recebida!');
    
    // Fallback de segurança se o servidor enviar payload vazio
    let data = { 
        title: 'Viana 2026', 
        body: 'Nova notificação da organização.',
        url: '/'
    };
    
    if (event.data) {
        try {
            data = event.data.json(); // O teu servidor deve enviar um JSON
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: '/icon.png',
        badge: '/icon.png',
        vibrate: [200, 100, 200, 100, 200],
        requireInteraction: true,
        data: { url: data.url || '/' }
    };

    // Dispara a notificação para o ecrã do telemóvel
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// 5. Ação ao clicar na Notificação
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Clique na notificação.');
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === self.registration.scope && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});
