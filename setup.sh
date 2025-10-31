#!/bin/bash

# Express Webhook Server - Bash Setup Script
# Bu script'i çalıştırarak projeyi otomatik olarak kuracaksınız
# Kullanım: chmod +x setup.sh && ./setup.sh

set -e  # Hata oluştuğunda script'i durdur

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

# Fonksiyonlar
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Ana kurulum fonksiyonu
main() {
    log_info "\n🚀 Express Webhook Server - Bash Kurulum Başlıyor\n"

    # Kontrol: Node.js ve npm kuruluyor mu?
    log_info "Adım 1: Node.js ve npm kontrol ediliyor..."
    if ! command -v node &> /dev/null; then
        log_error "Node.js bulunamadı! Lütfen Node.js'i kurun."
        echo "İndirme: https://nodejs.org/"
        exit 1
    fi
    NODE_VERSION=$(node -v)
    NPM_VERSION=$(npm -v)
    log_success "Node.js ${NODE_VERSION} ve npm ${NPM_VERSION} bulundu"

    # Git kuruluyor mu?
    if ! command -v git &> /dev/null; then
        log_warning "Git bulunamadı. Git kurmanız önerilir."
    else
        log_success "Git bulundu"
    fi

    # package.json kontrol
    log_info "\nAdım 2: package.json kontrol ediliyor..."
    if [ ! -f "package.json" ]; then
        log_error "package.json bulunamadı!"
        exit 1
    fi
    log_success "package.json bulundu"

    # npm install
    log_info "\nAdım 3: Bağımlılıklar yükleniyor (npm install)..."
    npm install
    log_success "npm bağımlılıkları başarıyla yüklendi"

    # .env dosyası
    log_info "\nAdım 4: .env dosyası ayarlanıyor..."
    if [ -f ".env" ]; then
        log_warning ".env dosyası zaten mevcut, atlanıyor"
    elif [ -f ".env.example" ]; then
        cp .env.example .env
        log_success ".env dosyası oluşturuldu (.env.example kopyalandı)"
    else
        cat > .env << EOF
NODE_ENV=development
PORT=3000
WEBHOOK_SECRET=your_secret_key_here
DATABASE_URL=mongodb://localhost:27017/webhook-server
API_KEY=your_api_key_here
EOF
        log_success "Varsayılan .env dosyası oluşturuldu"
    fi

    # Dizin yapısı
    log_info "\nAdım 5: Dizin yapısı kontrol ediliyor..."
    for dir in modules tests logs public views data; do
        mkdir -p "$dir"
    done
    log_success "Tüm dizinler hazır"

    # Modülleri kontrol et
    log_info "\nAdım 6: Modüller kontrol ediliyor..."
    if [ -d "modules" ]; then
        for module_dir in modules/*/; do
            if [ -d "$module_dir" ]; then
                module_name=$(basename "$module_dir")
                index_file="${module_dir}index.js"
                if [ ! -f "$index_file" ]; then
                    cat > "$index_file" << EOF
/**
 * ${module_name} Module
 */
module.exports = {
  name: '${module_name}',
  version: '1.0.0',
  init: function() {
    console.log('${module_name} module initialized');
  }
};
EOF
                    log_success "modules/${module_name}/index.js oluşturuldu"
                fi
            fi
        done
    fi

    # Veritabanı kontrol (MongoDB)
    log_info "\nAdım 7: Veritabanı kontrol ediliyor..."
    if command -v mongod &> /dev/null; then
        log_success "MongoDB bulundu"
        read -p "MongoDB'yi başlatmak ister misiniz? (evet/hayır): " start_mongodb
        if [ "$start_mongodb" = "evet" ] || [ "$start_mongodb" = "y" ]; then
            mongod --dbpath ./data &
            sleep 2
            log_success "MongoDB başlatıldı"
        fi
    else
        log_warning "MongoDB bulunamadı. Veritabanı işlevselliği sınırlı olacak."
    fi

    # Kurulum tamamlandı
    log_success "\n✨ Kurulum tamamlandı!\n"
    
    read -p "📚 Server şimdi başlatılsın mı? (evet/hayır): " start_server
    if [ "$start_server" = "evet" ] || [ "$start_server" = "y" ]; then
        log_info "🚀 Server başlatılıyor...\n"
        npm start
    else
        log_info "💡 Server'ı başlatmak için: npm start"
    fi
}

# Ana fonksiyonu çalıştır
main
