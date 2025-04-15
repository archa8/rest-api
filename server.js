require('dotenv').config(); // Load environment variables from .env file

const express = require('express'); // Import the express module
const app = express(); // Create an instance of express
const mongoose = require('mongoose'); // Import the mongoose module

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }) // subscribers database
/* What we did previously was that we included the localhost MongoDB URL and the database name in the connect method, but when we use the API, we don't need the localhost part, so we instead place the URI in the .env folder */

const db = mongoose.connection; // Get the connection object
db.on('error', (error) => console.error(error)); // Log any connection errors
db.once('open', () => console.log('Connected to Database')); // Log a message when connected

app.use(express.json()); // Middleware to parse JSON requests

const subscribersRouter = require('./routes/subscribers'); // Import the subscribers router
app.use('/subscribers', subscribersRouter); // Use the subscribers router for requests to /subscribers
/* 'localhost:3000/subscribers' -> This is the URL we will use to access the subscribers API */

app.listen(3000, () => { // Start the server on port 3000
  console.log('Server started'); // Log a message to the console
});