# Frontend Projesi

Bu proje, modern web teknolojileri kullanılarak geliştirilmiş bir e-ticaret frontend uygulamasıdır.

## Gereksinimler

- Node.js (v18.0.0 veya üzeri)
- npm veya yarn

## Teknolojiler

- React 18
- Vite
- TailwindCSS
- React Router DOM
- React Query
- Axios
- Radix UI
- Sonner (Toast bildirimleri için)
- Date-fns

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
npm install
# veya
yarn install
```

2. Çevre değişkenlerini ayarlayın:
```bash
cp .env.example .env
```
`.env` dosyasını kendi ortam değişkenlerinize göre düzenleyin.

## Geliştirme

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
# veya
yarn dev
```

Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

## Derleme

Projeyi production ortamı için derlemek için:

```bash
npm run build
# veya
yarn build
```

## Proje Yapısı

```
src/
  ├── components/     # Yeniden kullanılabilir bileşenler
  ├── pages/         # Sayfa bileşenleri
  ├── hooks/         # Özel React hooks'ları
  ├── App.jsx        # Ana uygulama bileşeni
  └── main.jsx       # Uygulama giriş noktası
```

## Özellikler

- Modern ve responsive tasarım
- Ürün listeleme ve detay sayfaları
- Debounce ile optimize edilmiş arama fonksiyonu
- Toast bildirimleri
- React Query ile etkin veri yönetimi
