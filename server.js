/* <!--
  Name: Jonathan Hernandez-Cardenas
  Date: 04.18.2025
  CSC 372-01

  This is the server file that initializes the server and lets you launch in local browser.
--> */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const jokeRoutes = require('./routes/jokeRoutes');

// initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// route
app.use('/jokebook', jokeRoutes);

// default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});