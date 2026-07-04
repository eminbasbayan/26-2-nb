const EventEmitter = require('node:events');

const eventEmitter = new EventEmitter();

eventEmitter.on('orderPizza', (detaylar) => {
  const { adet, boyut, icindekiler } = detaylar;
  console.log(
    `${adet} adet ${boyut} boyutunda pizza siparişi verildi. İçindekiler: ${icindekiler}`,
  );
});

eventEmitter.on('orderPizza', ({ boyut }) => {
  if (boyut === 'XL') {
    console.log('İçecek ücretsiz!');
  }
});

eventEmitter.emit('orderPizza', {
  boyut: 'XL',
  icindekiler: 'mantar, sosis, mısır, sucuk, kaşar',
  adet: 5,
});
