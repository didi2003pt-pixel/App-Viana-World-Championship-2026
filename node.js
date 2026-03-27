// server.js - Servidor Backend para Notificações Web Push
// Dependências necessárias: npm install express web-push cors body-parser

const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middlewares
app.use(cors()); // Permite que a app no GitHub comunique com este servidor
app.use(bodyParser.json());

// ==========================================
// CONFIGURAÇÃO DAS CHAVES VAPID (MUITO IMPORTANTE)
// 1. No terminal, corre: npx web-push generate-vapid-keys
// 2. Cola aqui a Public Key e a Private Key geradas.
// 3. Cola a mesma Public Key no teu index.html
// ==========================================
const publicVapidKey = 'COLA_AQUI_A_TUA_PUBLIC_KEY';
const privateVapidKey = 'COLA_AQUI_A_TUA_PRIVATE_KEY';

webpush.setVapidDetails(
    'mailto:geral@formulakite2026.com', // O teu email de contacto
    publicVapidKey,
    privateVapidKey
);

// Base de Dados "Falsa" (Guarda as subscrições na RAM)
// Em produção, devias guardar este array no Firebase, MongoDB ou PostgreSQL
let subscriptions = [];

// ----------------------------------------------------
// ENDPOINT 1: Guardar nova subscrição (Ativar Push)
// ----------------------------------------------------
app.post('/api/subscribe', (req, res) => {
    const subscription = req.body;
    
    // Verifica se já não temos este utilizador guardado
    const exists = subscriptions.find(sub => sub.endpoint === subscription.endpoint);
    if (!exists) {
        subscriptions.push(subscription);
        console.log('✅ Nova subscrição guardada! Total de utilizadores:', subscriptions.length);
    }

    res.status(201).json({ message: 'Subscrito com sucesso!' });
});

// ----------------------------------------------------
// ENDPOINT 2: Remover subscrição (Desativar Push)
// ----------------------------------------------------
app.post('/api/unsubscribe', (req, res) => {
    const { endpoint } = req.body;
    subscriptions = subscriptions.filter(sub => sub.endpoint !== endpoint);
    console.log('❌ Subscrição removida. Total de utilizadores:', subscriptions.length);
    res.status(200).json({ message: 'Removido com sucesso!' });
});

// ----------------------------------------------------
// ENDPOINT 3: Enviar Notificação para Todos (A tua "Botoeira")
// Podes acionar isto a partir de um painel de Admin oculto ou via Postman/Curl
// ----------------------------------------------------
app.post('/api/send-notification', async (req, res) => {
    const { title, body, url } = req.body;

    const payload = JSON.stringify({
        title: title || 'Viana 2026',
        body: body || 'Temos novidades no evento!',
        url: url || '/'
    });

    console.log(`🚀 A enviar notificação para ${subscriptions.length} telemóveis...`);

    // Dispara em paralelo para todos os subscritores
    const notificacoes = subscriptions.map((sub, index) => {
        return webpush.sendNotification(sub, payload).catch(error => {
            console.error('Erro ao enviar para telemóvel', index, error);
            // Se der erro 404 ou 410, o utilizador tirou as permissões nas definições do telemóvel
            // Por isso, apagamos da nossa "base de dados"
            if (error.statusCode === 404 || error.statusCode === 410) {
                console.log('A limpar subscrição inativa...');
                subscriptions = subscriptions.filter(s => s.endpoint !== sub.endpoint);
            }
        });
    });

    await Promise.all(notificacoes);
    res.status(200).json({ message: 'Notificações enviadas para a frota toda!' });
});

// Arrancar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🏁 Servidor de Notificações a correr em http://localhost:${PORT}`);
    console.log(`⚠️ NÃO TE ESQUEÇAS DE GERAR AS CHAVES VAPID: npx web-push generate-vapid-keys`);
});
