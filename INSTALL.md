# Express Webhook Server - Kurulum Rehberi

🎉 Bu rehber, Express Webhook Server projesini bilgisayarınıza kurup çalıştırmanız için gereken tüm adımları açıklamaktadır.

## 📋 İçindekiler

- [Sistem Gereksinimleri](#sistem-gereksinimleri)
- [Hızlı Kurulum (Otomatik)](#hızlı-kurulum-otomatik)
- [Adım Adım Kurulum (Manuel)](#adım-adım-kurulum-manuel)
- [Konfigürasyon](#konfigürasyon)
- [Troubleshooting](#troubleshooting)

---

## 🖥️ Sistem Gereksinimleri

### Zorunlu Gereksinimler

- **Node.js** v14.0.0 veya üstü
  - [nodejs.org](https://nodejs.org/) adresinden indirin
  - Sürüm kontrolü: `node -v`

- **npm** v6.0.0 veya üstü (Node.js ile birlikte gelir)
  - Sürüm kontrolü: `npm -v`

- **Git** (isteğe bağlı, klon yapmak için)
  - [git-scm.com](https://git-scm.com/) adresinden indirin

### İsteğe Bağlı Gereksinimler

- **MongoDB** (Veritabanı işlevleri için)
  - [mongodb.com](https://www.mongodb.com/) adresinden indirin
  - veya: `brew install mongodb` (Mac)
  - veya: `sudo apt-get install mongodb` (Ubuntu)

- **Postman** (API testi için)
  - [postman.com](https://www.postman.com/) adresinden indirin

---

## 🚀 Hızlı Kurulum (Otomatik)

En kolay ve hızlı yöntem, otomatik kurulum scriptlerini kullanmaktır.

### Windows

```batch
node setup.js
```

veya npm ile:

```batch
npm run setup
```

### macOS / Linux / Unix

```bash
chmod +x setup.sh
./setup.sh
```

veya npm ile:

```bash
npm run setup
```

**Bu scriptler otomatik olarak:**
- ✅ Node.js ve npm versiyonlarını kontrol eder
- ✅ npm bağımlılıklarını yükler
- ✅ .env dosyasını oluşturur
- ✅ Dizin yapısını hazırlar
- ✅ Modüllerini başlatır
- ✅ Veritabanını hazırlar (varsa)
- ✅ Server'ı başlatır (isteğe bağlı)

---

## 📝 Adım Adım Kurulum (Manuel)

Manuel olarak kurmak istiyorsanız, aşağıdaki adımları takip edin:

### Adım 1: Projeyi İndirin

```bash
# Git ile klonlama
git clone https://github.com/drylixirfoods-jpg/express-webhook-server.git
cd express-webhook-server

# veya ZIP olarak indir ve aç
# https://github.com/drylixirfoods-jpg/express-webhook-server/archive/main.zip
```

### Adım 2: Node.js Bağımlılıklarını Yükleyin

```bash
npm install
```

**Bu komut:**
- `package.json` dosyasını okur
- `node_modules` klasörü oluşturur
- Tüm gerekli modülleri indirir

### Adım 3: Ortam Değişkenlerini Yapılandırın

```bash
# .env.example'ı kopyalayarak .env oluşturun
cp .env.example .env

# .env dosyasını açarak değerleri düzenleyin
# nano .env (Linux/Mac)
# veya text editörle açın (Windows)
```

**Temel .env Değerleri:**

```env
# Node.js Ortamı
NODE_ENV=development      # development, production, test

# Server Portu
PORT=3000                 # Hangi portta çalışacak

# Webhook İçin Gizli Anahtar
WEBHOOK_SECRET=your_secret_key_here

# Veritabanı Bağlantısı
DATABASE_URL=mongodb://localhost:27017/webhook-server

# API Anahtarı
API_KEY=your_api_key_here
```

### Adım 4: Veritabanını Başlatın (İsteğe Bağlı)

MongoDB kullanıyorsanız:

```bash
# MongoDB Server'ını başlat
mongod --dbpath ./data

# Başka bir terminal penceresinde devam edin
```

### Adım 5: Server'ı Başlatın

```bash
npm start
```

Başarılı olduysa, şöyle bir mesaj görülecektir:

```
🚀 Server is running on http://localhost:3000
📝 Webhook API ready
✅ All modules initialized
```

### Adım 6: Server'ı Test Edin

```bash
# Yeni bir terminal penceresinde
curl http://localhost:3000

# veya
curl http://localhost:3000/health
```

---

## ⚙️ Konfigürasyon

### .env Dosyası

`.env` dosyasında aşağıdaki değişkenleri ayarlayabilirsiniz:

| Değişken | Açıklama | Varsayılan |
|----------|----------|----------|
| `NODE_ENV` | Çalıştırma modu | `development` |
| `PORT` | Server'ın çalışacağı port | `3000` |
| `WEBHOOK_SECRET` | Webhook doğrulama gizli anahtarı | *(zorunlu)* |
| `DATABASE_URL` | MongoDB bağlantı adresi | `mongodb://localhost:27017/webhook-server` |
| `API_KEY` | API kimlik doğrulaması anahtarı | *(zorunlu)* |
| `LOG_LEVEL` | Loglama seviyesi | `info` |

### npm Scripts

```bash
# Server'ı başlat (otomatik kurulum ile)
npm run setup

# Server'ı geliştirme modunda başlat (nodemon ile)
npm run dev

# Testleri çalıştır
npm test

# Production build
npm run build
```

### Dizin Yapısı

```
express-webhook-server/
├── modules/              # Webhook modülleri
│   ├── prospecting/
│   ├── reels/
│   ├── growth/
│   └── ...
├── tests/                # Test dosyaları
│   └── webhook-tests.js
├── logs/                 # Uygulama logları
├── data/                 # Veritabanı verileri
├── public/               # Statik dosyalar
├── views/                # Template dosyaları
├── server.js             # Ana server dosyası
├── setup.js              # Node.js setup script'i
├── setup.sh              # Bash setup script'i
├── package.json          # npm bağımlılıkları
├── .env.example          # Ortam değişkenleri şablonu
└── README.md             # Proje açıklaması
```

---

## 🐛 Troubleshooting

### Sorun: "npm: command not found"

**Çözüm:** Node.js veya npm düzgün kurulmamış olabilir.
- Node.js [nodejs.org](https://nodejs.org/) adresinden indirin
- Kurulum sonrası terminali yeniden başlatın

### Sorun: "Port 3000 already in use"

**Çözüm:** Başka bir uygulama 3000 portunu kullanıyor.

```bash
# .env dosyasında PORT değişkenini değiştirin
# PORT=3001

# veya mevcut process'i kill edin
# Linux/Mac
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Sorun: "MongoDB connection refused"

**Çözüm:** MongoDB server'ı çalıştırılmamış.

```bash
# MongoDB'yi başlat
mongod --dbpath ./data

# veya sistem servisi olarak
# Linux
sudo systemctl start mongod

# macOS
brew services start mongodb-community
```

### Sorun: "Module not found"

**Çözüm:** npm bağımlılıkları yüklenmemiş olabilir.

```bash
# Yeniden yükleyin
rm -rf node_modules package-lock.json
npm install
```

### Sorun: "permission denied" (setup.sh)

**Çözüm:** Script dosyasına execute izni verin.

```bash
chmod +x setup.sh
./setup.sh
```

---

## 📚 Ek Kaynaklar

- [Express.js Dokümentasyonu](https://expressjs.com/)
- [Node.js Dokümentasyonu](https://nodejs.org/docs/)
- [MongoDB Dokümentasyonu](https://docs.mongodb.com/)
- [npm Dokümentasyonu](https://docs.npmjs.com/)

---

## ✅ Kontrol Listesi

Kurulumunuzun başarılı olduğunu doğrulamak için:

- [ ] Node.js v14+ yüklü mü? (`node -v`)
- [ ] npm yüklü mü? (`npm -v`)
- [ ] Proje klonlandı mı veya indirildi mi?
- [ ] `npm install` başarıyla tamamlandı mı?
- [ ] `.env` dosyası oluşturuldu mu?
- [ ] MongoDB çalışıyor mu? (isteğe bağlı)
- [ ] Server başlatılabiliyor mu? (`npm start`)
- [ ] `http://localhost:3000` erişilebiliyor mu?

---

## 🆘 Yardım

Probleminizi çözemediniz mi?

1. **Issues** sayfasını kontrol edin: [GitHub Issues](https://github.com/drylixirfoods-jpg/express-webhook-server/issues)
2. Sorununuzu açıkça tanımlayan bir **Issue** açın
3. Hata mesajı ve sistem bilgilerini ekleyin

---

## 📄 Lisans

Bu proje MIT Lisansı altında sunulmaktadır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

**Kurulum tamamlandı! Başarılar! 🎉**
