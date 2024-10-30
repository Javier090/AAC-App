const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware CORS: Enables Cross-Origin Resource Sharing, JSON parser for requests
app.use(cors());
app.use(express.json());

// Routes for the API
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);
app.use('/images', express.static('images'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
