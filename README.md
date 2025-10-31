# Social Media AI Automation Platform (on Express Webhook Server)

Bu repo, mevcut Express.js webhook sunucusunu temel alarak; tüm sosyal medya hesaplarının analizini yapan, potansiyel müşterileri tespit eden, içerik üreten, e-ticaret entegrasyonu sağlayan ve çok kanallı otomasyonları AI destekli olarak orkestre eden modüler bir platform haline getirir.

Ana hedefler:
- Potansiyel müşteri tespiti ve araştırma (prospecting & enrichment)
- Instagram/TikTok Reels üretimi ve zamanlama/publish
- Takipçi topluluk büyütme (etik ve platform kurallarına uygun growth playbook'ları)
- E-ticaret entegrasyonu (ürün senkron, katalog, sipariş webhook’ları)
- YouTube için popüler video üretimi (Veo 3.1 ile senaryo ve varlık üretimi)
- Instagram yorum ve DM otomasyonu (cevap, sınıflandırma, CRM’e işleme)
- Randevu oluşturma ve çok kanallı sohbet (WhatsApp, IG DM, Web chat)
- Danışanlara sesli arama ile memnuniyet anketi (Voice/RTC entegrasyonu)
- Tüm modüller için yapay zekâ destekli analiz ve karar mekanizmaları

Uyarı ve sorumluluk reddi:
- Platform politikaları: Instagram, TikTok, YouTube, Meta, Google vb. platformların API kullanım koşulları, otomasyon ve spam politikalarına kesinlikle uyun. Scraping ve izinsiz otomasyon yapmayın. Bu repo yalnızca resmi API’ler ve izinli entegrasyonlar hedeflenerek tasarlanmıştır.
- Gizlilik ve KVKK/GDPR: Kişisel verileri işlerken açık rıza ve yasal gereklilikleri karşılayın. Loglar ve depolama için veri minimizasyonu uygulayın.

## Mimari

Monorepo benzeri bir klasör yapısı ile her modül bağımsız servis/kitaplık olarak tasarlanır. Express webhook sunucusu (server.js) ise:
- Webhook alım ve doğrulama
- Olayların kuyruğa alınması (ör. BullMQ/Redis veya basit in-memory kuyruk)
- Modül orchestrator’a yayınlama
rollerini üstlenir.

```
/express-webhook-server
├─ server.js                 # Ana Express webhook sunucusu
├─ package.json
├─ .env.example
├─ README.md
└─ modules/
   ├─ prospecting/
   │  ├─ index.js
   │  └─ README.md
   ├─ reels/
   │  ├─ index.js
   │  └─ README.md
   ├─ growth/
   │  ├─ index.js
   │  └─ README.md
   ├─ ecommerce/
   │  ├─ index.js
   │  └─ README.md
   ├─ youtube/
   │  ├─ index.js
   │  └─ README.md
   ├─ instagram/
   │  ├─ index.js
   │  └─ README.md
   ├─ appointments/
   │  ├─ index.js
   │  └─ README.md
   ├─ voice/
   │  ├─ index.js
   │  └─ README.md
   └─ ai/
      ├─ orchestrator.js
      └─ providers/
         ├─ openai.js
         ├─ meta.js
         └─ google.js
```

## Ortam Değişkenleri (.env)

Örnek (tamamını ihtiyacınıza göre düzenleyin; gizli anahtarları ASLA commit etmeyin):

```
# Server
PORT=3000
NODE_ENV=development
VERIFY_TOKEN=your_webhook_verify_token
ALLOW_ORIGINS=http://localhost:3000
LOG_LEVEL=debug

# Datastore / Queue (opsiyonel)
REDIS_URL=redis://localhost:6379

# Instagram / Meta
META_APP_ID=...
META_APP_SECRET=...
META_PAGE_ID=...
META_IG_BUSINESS_ID=...
META_ACCESS_TOKEN=...

# YouTube / Google
GOOGLE_PROJECT_ID=...
GOOGLE_CLIENT_EMAIL=...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
YOUTUBE_CHANNEL_ID=...

# TikTok (varsa resmi API erişimi)
TIKTOK_CLIENT_KEY=...
TIKTOK_CLIENT_SECRET=...

# E-commerce (Shopify veya Woo gibi)
SHOPIFY_STORE_DOMAIN=...
SHOPIFY_ADMIN_API_TOKEN=...

# AI Providers
OPENAI_API_KEY=...
GOOGLE_GENAI_API_KEY=...
META_VEO_API_KEY=...  # Veo 3.1 benzeri jeneratif video model erişimi için placeholder

# Telephony / Voice
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_CALLER_NUMBER=+1...
```

## Başlangıç Kurulum

1) Bağımlılıklar
```
npm install
```

2) Geliştirme
```
npm run dev
```

3) Prod
```
npm start
```

## Modüller ve Başlangıç Kodları

Aşağıdaki örnekler modules/ altında eklenecek minimal başlangıç kodlarını gösterir. Her biri gerçek API çağrılarını soyutlayan placeholder fonksiyonlar içerir. Gerçek anahtarları ve izinli API endpoint’lerini ekleyin.

### 1) Prospecting (Potansiyel Müşteri Tespiti ve Araştırma)
modules/prospecting/index.js
```js
const { aiComplete } = require('../ai/orchestrator');

async function discoverLeads({ niche, platforms = ['instagram','youtube'] }) {
  // Not: Sadece resmi arama API’lerini kullanın. Scraping önermiyoruz.
  const hints = await aiComplete(`Hedef kitle nişi: ${niche}. Hangi içerik formatları ve hashtagler etkilidir? 5 öneri ver.`);
  return { leads: [], strategy: hints }; // leads: enrichment sonrası doldurulacak
}

async function enrichLead(lead) {
  // Örn: Clearbit, PeopleData, resmi platform graph API’leri
  return { ...lead, score: 0.87 };
}

module.exports = { discoverLeads, enrichLead };
```

### 2) Reels Video Üretimi ve Paylaşımı
modules/reels/index.js
```js
const { aiComplete } = require('../ai/orchestrator');

async function generateReelScript(topic) {
  return aiComplete(`Instagram Reels için 30-45 sn script yaz. Konu: ${topic}. Kanca, fayda, CTA.`);
}

async function renderReelAssets(script) {
  // Placeholder: SRT, görüntü, müzik önerileri üretimi
  return { videoPath: '/tmp/reel.mp4', captions: '...srt...' };
}

async function publishReel({ videoPath, caption }) {
  // Instagram Graph API ile publish (içerik politikalarına uyum şart)
  return { status: 'queued', id: 'ig_media_123' };
}

module.exports = { generateReelScript, renderReelAssets, publishReel };
```

### 3) Growth (Takipçi Sağlama - Etik Growth)
modules/growth/index.js
```js
async function runGrowthPlaybook({ niche }) {
  // Örn: İçerik takvimi, işbirliği, UGC kampanyaları. Takipçi satın alma YAPMAYIN.
  return { plan: ['UGC yarışması', 'Haftalık canlı yayın', 'Topluluk Q&A'] };
}

module.exports = { runGrowthPlaybook };
```

### 4) E-ticaret Entegrasyonu
modules/ecommerce/index.js
```js
async function syncCatalog(products) {
  // Shopify Admin API veya Woo REST API
  return { synced: products.length };
}

async function handleOrderWebhook(payload) {
  // server.js POST /webhook -> buraya yönlendirilebilir
  return { acknowledged: true };
}

module.exports = { syncCatalog, handleOrderWebhook };
```

### 5) YouTube Popüler Video Üretimi (Veo 3.1)
modules/youtube/index.js
```js
const { aiComplete } = require('../ai/orchestrator');

async function ideatePopularTopics({ niche }) {
  return aiComplete(`YouTube için ${niche} alanında yüksek potansiyelli 5 video fikri öner.`);
}

async function generateVideoAssets({ idea }) {
  // Veo 3.1 veya benzeri: storyboard + B-roll listesi + voiceover metni
  return { storyboard: '...', voiceover: '...' };
}

async function publishToYouTube({ title, description, filePath }) {
  // YouTube Data API v3 yükleme akışı (yetkiler gerekli)
  return { videoId: 'yt_abc123' };
}

module.exports = { ideatePopularTopics, generateVideoAssets, publishToYouTube };
```

### 6) Instagram Yorum ve DM Otomasyonu
modules/instagram/index.js
```js
const { aiClassify, aiComplete } = require('../ai/orchestrator');

async function autoReplyComment(comment) {
  const intent = await aiClassify(comment.text, ['satis','destek','tesekkur','sorun']);
  const reply = await aiComplete(`Kısa, samimi ve markaya uygun cevap yaz. Niyet: ${intent}. Yorum: ${comment.text}`);
  return { reply };
}

async function autoReplyDM(message) {
  const reply = await aiComplete(`DM mesajına uygun, net ve aksiyon odaklı cevap oluştur: ${message}`);
  return { reply };
}

module.exports = { autoReplyComment, autoReplyDM };
```

### 7) Randevu Oluşturma ve Sohbet
modules/appointments/index.js
```js
async function proposeSlots({ timezone }) {
  // Google Calendar / Calendly API entegrasyonu
  return [{ start: '2025-11-02T09:00:00Z', end: '2025-11-02T09:30:00Z' }];
}

async function bookSlot({ slot, customer }) {
  // Calendar API ile rezervasyon
  return { booked: true, eventId: 'cal_evt_123' };
}

module.exports = { proposeSlots, bookSlot };
```

### 8) Sesli Arama ile Memnuniyet
modules/voice/index.js
```js
async function callAndSurvey({ to, script }) {
  // Twilio Programmable Voice veya benzeri ile TTS + DTMF/ASR anketi
  return { callSid: 'CA123', status: 'completed', score: 4.7 };
}

module.exports = { callAndSurvey };
```

### 9) AI Orchestrator
modules/ai/orchestrator.js
```js
const providers = require('./providers');

async function aiComplete(prompt) {
  return providers.openai.complete(prompt); // Basit yönlendirme, fallback eklenebilir
}

async function aiClassify(text, labels) {
  return providers.openai.classify(text, labels);
}

module.exports = { aiComplete, aiClassify };
```

modules/ai/providers/openai.js
```js
const fetch = require('node-fetch');

async function complete(prompt) {
  // OpenAI veya uyumlu LLM endpoint’i – güvenli prompt, denetim
  return `AI: ${prompt.slice(0,60)}...`; // placeholder
}

async function classify(text, labels) {
  // Basit mock sınıflandırma
  return labels[0];
}

module.exports = { complete, classify };
```

## Webhook Akışı Örneği

server.js içindeki POST / webhook’una gelen olaylar modüllere yönlendirilebilir:

```js
// server.js içinde örnek routing (özet)
app.post('/', async (req, res) => {
  try {
    const event = req.body;
    // Örn: Instagram comment event
    if (event.type === 'ig.comment') {
      const ig = require('./modules/instagram');
      const result = await ig.autoReplyComment(event.data);
      return res.json({ received: true, action: result });
    }
    // Örn: E-ticaret sipariş webhooks
    if (event.type === 'shopify.order.created') {
      const ec = require('./modules/ecommerce');
      const ack = await ec.handleOrderWebhook(event.data);
      return res.json({ received: true, ack });
    }
    return res.json({ received: true });
  } catch (e) {
    console.error('Webhook error', e);
    return res.status(500).json({ error: 'internal_error' });
  }
});
```

## Güvenlik ve Uyum
- Yalnızca resmi API’leri kullanın; token ve webhooks doğrulaması zorunlu.
- Oran sınırlaması, denetim logları, hata yönetimi ve PII maskeleme uygulayın.
- Kullanıcı rızası ve platform TOS’una uyum kritik.

## Yol Haritası
- [ ] Redis tabanlı kuyruk ve işleyiciler (BullMQ)
- [ ] Çok sağlayıcılı AI fallback ve maliyet kontrolü
- [ ] İçerik takvimi ve yayınlama orkestrasyonu
- [ ] E-ticaret müşteri segmentasyonu ve LTV tahmini
- [ ] Reels auto-caption + telif güvenli müzik entegrasyonu
- [ ] Sesli arama için gerçek zamanlı ASR/TTS entegrasyonu

## Lisans
MIT
