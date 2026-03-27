// service-worker.js - Formula Kite 2026 PWA

const CACHE_NAME = 'viana-2026-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/acesso.html',
    '/icon.png',
    '/image_11335c.png'
];

// 1. Instalação do Service Worker (Cache de assets iniciais para modo Offline)
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Instalado. Preparando PWA Offline...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] A fazer cache dos ficheiros principais');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting()) // Força a ativação imediata
    );
});

// 2. Ativação (Limpeza de caches antigos quando atualizas a App)
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Ativado.');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] A apagar cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Assume controlo imediato das páginas abertas
    );
});

// 3. Estratégia Fetch: Tentar a rede, cair para o Cache (ideal para apps dinâmicas)
self.addEventListener('fetch', (event) => {
    // Ignora chamadas para APIs externas (ex: Leaflet, mapas do Google)
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});

// 4. Evento Principal de Push Notifications (Recebe do Servidor e mostra ao Cliente)
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push Recebido.');
    
    // Payload por defeito caso falhe
    let data = { 
        title: 'Viana 2026 🏁', 
        body: 'Nova atualização do evento!' 
    };
    
    if (event.data) {
        try {
            // Tenta processar o payload enviado pelo servidor como JSON
            data = event.data.json();
        } catch (e) {
            // Se for apenas texto simples
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: '/icon.png',
        badge: '/icon.png', // Ícone pequeno na barra de notificações do Android
        vibrate: [200, 100, 200, 100, 200], // Padrão de vibração dinâmico
        requireInteraction: true, // Mantém a notificação visível até o utilizador clicar/fechar
        data: { 
            url: '/' // Onde o utilizador vai parar se clicar na notificação
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// 5. Ação ao clicar na Notificação (Abre ou traz a App para primeiro plano)
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Clique na notificação detetado.');
    
    // Fecha a notificação do ecrã
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Se a app já estiver aberta em segundo plano, traz para a frente (foca)
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === self.registration.scope && 'focus' in client) {
                    return client.focus();
                }
            }
            // Se a app estiver fechada, abre-a
            if (clients.openWindow) {
                return clients.openWindow(event.notification.data.url);
            }
        })
    );
});
