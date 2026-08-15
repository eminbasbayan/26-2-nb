const corsOptions = {
  origin: function (origin, callback) {
    // İzin verilen origins listesi
    // Burada iyzicodan yapılan işlemlerde CORS hatası olabiliyor.
    // İyzico'nun ödeme formunu gömme/iframe ile açınca veya iyzico callback ile döndüğünde frontend'e
    // kendi alan adından erişmeye çalışabilir.
    // İyzico dökümanları:
    // https://dev.iyzipay.com/tr/odeme-formu/odeme-formu-ile-odeme/#bir-payment-request-olusturma
    // https://dev.iyzipay.com/tr/odeme-formu/iyzico-checkout-form-ve-callback-url/
    // Buradaki whitelist'e iyzico callback veya iframe için kullanılan domainleri de eklemen gerekebilir.
    // Eğer iyzico'dan gelen requestlerde origin undefined oluyorsa, if (!origin) koşulu zaten izin verir.

    const whiteList = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://www.google.com',
      // İyzico'dan dönen call için gerekirse domain ekle
      // Örnekler:
      'https://sandbox-merchant.iyzipay.com',
      'https://merchant.iyzipay.com',
      'https://iyziconext.iyzipay.com',
      'https://api.iyzipay.com',
      'https://sandbox-api.iyzipay.com',
      // Kullandığın ortam veya iyzico size ödeme formunu hangi origin'den açıyorsa onu ekle
    ];

    if (!origin || whiteList.indexOf(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS politikası tarafından engellendiniz.'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 saat
};

module.exports = corsOptions;
