# Node.js base image
FROM node:18-alpine

# Çalışma dizinini oluştur
WORKDIR /usr/src/app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm ci --only=production

# Kaynak kodları kopyala
COPY . .

# Port
EXPOSE 3010

# Uygulamayı başlat
CMD ["npm", "start"] 