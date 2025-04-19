const express = require('express');
const router = express.Router();
const JokeController = require('../controllers/jokeController');


// route definitions 
router.get('/categories', JokeController.getCategories);
router.get('/joke/:category', JokeController.getJokesByCategory);
router.get('/random', JokeController.getRandomJoke);
router.post('/joke/add', JokeController.addJoke);

module.exports =router;