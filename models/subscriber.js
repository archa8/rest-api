const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({ // Define the schema for the subscriber model
  name: {
    type: String,
    required: true // Name is required
  },
  subscribedToChannel: {
    type: String,
    required: true // Channel is required
  },
  subscribeDate: {
    type: Date,
    reuired: true,
    default: Date.now // Default to current date
  }
});

module.exports = mongoose.model('Subscriber', subscriberSchema); // Create the model and export it
//'subscriber' is the name of the model, and 'subscriberSchema' is the schema we defined above. Mongoose will create a collection named 'subscribers' in the database based on this model.

// .model(): when exported, and then imported in a different file, it allows to interact with the database directly using the schema defined above