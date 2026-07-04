const EventEmitter = require('node:events');

class PizzaShop extends EventEmitter {
  constructor() {
    super();
    this.orderNumber = 0;
  }

  order(adet, icindekiler, boyut) {
    this.emit('orderPizza', adet, icindekiler, boyut);
    this.orderNumber++;
  }

  displayOrderNumber() {
    console.log(`Mevcut sipariş numarası: ${this.orderNumber}`);
  }
}

module.exports = PizzaShop;
