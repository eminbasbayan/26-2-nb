const EventEmitter = require('node:events');

const eventEmitter = new EventEmitter();

// Özel bir event dinleyicisi on()
eventEmitter.on('hello', () => {
  console.log('Hello World!');
});

eventEmitter.on('hello', () => {
  console.log('Hello World! 2');
});

// "hello" eventini tetikle emit()
eventEmitter.emit('hello');
