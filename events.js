const EventEmitter = require('node:events');
const PizzaShop = require('./pizzaShop.js');
const DrinkMachine = require('./drinkMachine.js');

const eventEmitter = new EventEmitter();
const pizzaShop = new PizzaShop();
const drinkMachine = new DrinkMachine();

pizzaShop.on('orderPizza', (adet, icindekiler, boyut) => {
  console.log(
    `${adet} adet ${boyut} boyutunda pizza siparişi verildi. İçindekiler: ${icindekiler}`,
  );

  drinkMachine.serveDrink(boyut);
});

pizzaShop.order(5, 'mantar, sosis, mısır, sucuk, kaşar', 'XL');
pizzaShop.displayOrderNumber()


/* eventEmitter.on('orderPizza', (detaylar) => {
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
 */
