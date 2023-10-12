const EventEmitter = require('events');

class MyComponent extends EventEmitter {
  constructor() {
    super();
    // Increase the limit to 20 (or any other appropriate value)
    this.setMaxListeners(100);
  }

  // Add custom methods and event listeners for your component
  someMethod() {
    // Your component's logic here
    // Emit an event when something happenss
    this.emit('somethingHappened', { data: 'some data' });
  }
}

// Usage of the custom component
const myInstance = new MyComponent();

// Add event listeners
myInstance.on('somethingHappened', (eventData) => {
  console.log('Something happened:', eventData);
});

// Call a method that triggers an event
myInstance.someMethod();