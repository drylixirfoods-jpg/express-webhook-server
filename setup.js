#!/usr/bin/env node

/**
 * Express Webhook Server - Automatic Setup Script
 * 
 * Bu script'i çalıştırarak:
 * 1. Proje bağımlılıklarını yükler (npm install)
 * 2. .env dosyasını oluşturur
 * 3. Veritabanını başlatır
 * 4. Server'ı başlatır
 * 
 * Kullanım: node setup.js
 * veya: npm run setup
 */

const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function question(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function setupProject() {
  log('\n🚀 Express Webhook Server - Otomatik Kurulum Başlıyor\n', 'blue');

  try {
    // Step 1: package.json kontrol
    log('📦 Adım 1: package.json kontrol ediliyor...', 'yellow');
    if (!fs.existsSync('package.json')) {
      log('❌ package.json bulunamadı!', 'red');
      process.exit(1);
    }
    log('✅ package.json bulundu', 'green');

    // Step 2: npm install
    log('\n📦 Adım 2: Bağımlılıklar yükleniyor (npm install)...', 'yellow');
    try {
      execSync('npm install', { stdio: 'inherit' });
      log('✅ npm bağımlılıkları başarıyla yüklendi', 'green');
    } catch (error) {
      log('❌ npm install sırasında hata oluştu', 'red');
      process.exit(1);
    }

    // Step 3: .env dosyası oluştur
    log('\n⚙️  Adım 3: .env dosyası ayarlanıyor...', 'yellow');
    const envExamplePath = '.env.example';
    const envPath = '.env';

    if (fs.existsSync(envPath)) {
      log('⚠️  .env dosyası zaten mevcut, atlanıyor', 'yellow');
    } else if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      log('✅ .env dosyası oluşturuldu (.env.example kopyalandı)', 'green');
    } else {
      // Default .env oluştur
      const defaultEnv = `NODE_ENV=development
PORT=3000
WEBHOOK_SECRET=your_secret_key_here
DATABASE_URL=mongodb://localhost:27017/webhook-server
API_KEY=your_api_key_here
`;
      fs.writeFileSync(envPath, defaultEnv);
      log('✅ Varsayılan .env dosyası oluşturuldu', 'green');
    }

    // Step 4: Dizin yapısını kontrol et
    log('\n📁 Adım 4: Dizin yapısı kontrol ediliyor...', 'yellow');
    const dirs = ['modules', 'tests', 'logs', 'public', 'views'];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        log(`✅ ${dir}/ klasörü oluşturuldu`, 'green');
      }
    });

    // Step 5: Modülleri kontrol et
    log('\n📚 Adım 5: Modüller kontrol ediliyor...', 'yellow');
    const modulesDir = './modules';
    if (fs.existsSync(modulesDir)) {
      const modules = fs.readdirSync(modulesDir)
        .filter(file => fs.statSync(path.join(modulesDir, file)).isDirectory());
      
      modules.forEach(module => {
        const indexPath = path.join(modulesDir, module, 'index.js');
        if (!fs.existsSync(indexPath)) {
          const templateCode = `/**
 * ${module} Module
 */
module.exports = {
  name: '${module}',
  version: '1.0.0',
  init: function() {
    console.log('${module} module initialized');
  }
};
`;
          fs.writeFileSync(indexPath, templateCode);
          log(`✅ modules/${module}/index.js oluşturuldu`, 'green');
        }
      });
    }

    // Step 6: Başlat mı?
    log('\n✨ Kurulum tamamlandı!', 'green');
    const startServer = await question('\n🤔 Server şimdi başlatılsın mı? (evet/hayır): ');
    
    if (startServer.toLowerCase() === 'evet' || startServer.toLowerCase() === 'y') {
      log('\n🚀 Server başlatılıyor...\n', 'blue');
      rl.close();
      exec('npm start');
    } else {
      log('\n💡 Server'ı başlatmak için: npm start', 'yellow');
      rl.close();
    }
  } catch (error) {
    log(`\n❌ Hata: ${error.message}`, 'red');
    rl.close();
    process.exit(1);
  }
}

setupProject();
