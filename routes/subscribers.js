const express = require('express');
const router = express.Router(); // Create a new router object; router portion of express
const Subscriber = require('../models/subscriber'); // Import the Subscriber model

// Getting all subscribers
router.get('/', async (req, res) => {
  try {
    const subscribers = await Subscriber.find(); // Find all subscribers in the database
    res.json(subscribers); // Send the subscribers as a JSON response
  } catch (err) {
    res.status(500).json({ message: err.message }) // Send an error message if something goes wrong, with the status code 500 (Internal Server Error): error with our server
  }
})

// Getting one
router.get('/:id', getSubscriber,  (req, res) => {
  /* res.send(req.params.id) // To access the value of the “id” parameter, you can use req.params.id in your route handler. This will give you the value of the “id” parameter from the URL. For example, if the URL is /subscribers/123, req.params.id will be 123. */
  res.json(res.subscriber); // Send the found subscriber as a JSON response
})

// Creating one
router.post('/', async (req, res) => {
  const subscriber = new Subscriber({ // Create a new subscriber object using the Subscriber model
    name: req.body.name, // Get the name from the request body
    subscribedToChannel: req.body.subscribedToChannel, // Get the channel from the request body
    subscribeDate: req.body.subscribeDate // Get the subscription date from the request body
  })
  try {
    const newSubscriber = await subscriber.save(); // Save the new subscriber to the database
    res.status(201).json(newSubscriber); // Send a response with status code 201 (Successfully created) (201 is more specific than 200, which is why it is used) and the new subscriber as JSON
  } catch (err) {
    res.status(400).json({ message: err.message }) // Send an error message if something goes wrong, with status code 400 (Bad Request): error with user request; it will fail if user does not pass on the name or the channel they are subscribing to and so on => fails on user giving bad data
  }
})

// Updating one
router.patch('/:id', getSubscriber, async (req, res) => { // use patch instead of put because we want only to store what the user gives/passes, not the whole information, which the user might not have entered (As null)
  if (req.body.name != null) {
    res.subscriber.name = req.body.name
  }
  if (req.body.subscribedToChannel != null) {
    res.subscriber.name = req.body.subscribedToChannel
  }
  try {
    const updatedSubscriber = await res.subscriber.save(); // Save the updated subscriber to the database
    res.json(updatedSubscriber); // Send the updated subscriber as a JSON response
  } catch (err) {
    res.status(400).json({ message: err.message }) // Send an error message if something goes wrong, with status code 400 (Bad Request): error with user request; it will fail if user does not pass on the name or the channel they are subscribing to and so on => fails on user giving bad data
  }
})

// Deleting one
router.delete('/:id', getSubscriber, async (req, res) => {
  try {
    await res.subscriber.deleteOne(); // Remove the subscriber from the database
    res.json({ message: 'Deleted Subscriber' }) // Send a response indicating that the subscriber has been deleted
  } catch (err) {
    res.status(500).json({ message: err.message }) // Send an error message if something goes wrong, with status code 500 (Internal Server Error): error with our server
  }
})

// All the methods (GET, PATCH, DELETE) require the id to be passed, so we make a middleware function to check if the id is valid before proceeding with the request. This middleware function will be called before the actual route handler for the GET, PATCH, and DELETE requests.
async function getSubscriber(req, res, next) { // If next is encountered, move to the next section of the code, which is going to be the callback function (GET, DELETE, etc.)
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id); // Find the subscriber by ID in the database
    if (subscriber == null) { // If no subscriber is found, send a 404 error
      return res.status(404).json({ message: 'Cannot find subscriber' }) // Send a 404 error if the subscriber is not found
    }
  } catch (err) {
    return res.status(500).json({ message: err.message }) // Send a 500 error if something goes wrong with our server
  }
  res.subscriber = subscriber; // Store the found subscriber in the response object for use in the next middleware or route handler
  next(); // Call the next middleware or route handler
}

module.exports = router; // Export the router object