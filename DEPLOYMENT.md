# Coolify deployment

Bu proje Coolify'da Git tabanli bir Docker Compose kaynagi olarak calisir. Gercek
gizli degerler GitHub'a eklenmez; Coolify ortam degiskenlerinde saklanir.

## Coolify kaynagi

- Repository: `https://github.com/eminbasbayan/26-2-nb`
- Branch: `main`
- Build pack: `Docker Compose`
- Base directory: `/`
- Compose file: `/docker-compose.coolify.yml`
- Disariya acilan servis: `api-gateway`, port `3000`

Gateway domain alanina ic portu da yazin: `https://uygulama.example.com:3000`.
MongoDB ve uc uygulama servisine public domain veya host portu vermeyin.

## Coolify ortam degiskenleri

Asagidaki degerleri Coolify kaynaginin **Environment Variables** bolumunde
production icin tanimlayin:

```dotenv
APP_URL=https://uygulama.example.com
JWT_SECRET=<en-az-32-karakter-rastgele-deger>
JWT_EXPIRES_IN=1w
COOKIE_SECURE=true
IYZICO_API_KEY=<iyzico-api-key>
IYZICO_SECRET_KEY=<iyzico-secret-key>
IYZICO_URI=https://sandbox-api.iyzipay.com
```

`APP_URL` sonuna `/` koymayin. Odeme callback adresi Compose tarafindan
`APP_URL/api/payments/callback` olarak uretilir. MongoDB URI'lari servislerin
ayri mantiksal veritabanlarini kullanacak sekilde Compose dosyasinda ic aga
sabitlenmistir; public MongoDB adresi gerekmez.

## GitHub Actions ile CI/CD

Coolify'da API erisimini etkinlestirin, yalnizca `Deploy` yetkili bir token
olusturun ve uygulamanin **Deploy Webhook** adresini alin. GitHub repository
ayarlarinda su Actions secret'larini tanimlayin:

- `COOLIFY_WEBHOOK`
- `COOLIFY_TOKEN`

Pull request'lerde ve `main` push'larinda dort servisin bagimlilik kurulumu,
JavaScript soz dizimi kontrolu, production Compose dogrulamasi ve image build
calisir. Yalnizca `main` kontrolleri basarili oldugunda Coolify webhook'u
tetiklenir.

## Elle dogrulama

```bash
docker compose -f docker-compose.coolify.yml config --quiet
curl -fsS https://uygulama.example.com/health
```
