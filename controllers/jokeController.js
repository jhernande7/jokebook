const JokeModel = require('../models/jokeModel');

const JokeController = {

    //get all categories
    getCategories: async (req, res) => {
        try {
            const categories = await JokeModel.getCategories();
            res.json(categories);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },


    // get jokes by category
    getJokesByCategory: async (req,res) => {
        try {
            const category = req.params.category;
            const limit = req.query.limit ? parseInt(req.query.limit) : null;

            const jokes = await JokeModel.getJokesByCategory(category, limit);
            res.json(jokes);
        } catch (err) {
            if (err.message === 'Category not found') {
                res.status(404).json({ error: 'Category not found' });
            } else {
                res.status(500).json({ error: err.message });
            }

        }
    },


    //get random joke
    getRandomJoke: async (req,res) => {
        try {
            const joke = await JokeModel.getRandomJoke();
            res.json(joke);
        } catch (err) {
            res.status(500).json({ error: err.messge});
        }
    },

    // add new joke
    addJoke: async (req, res) => {
        try {
            const { category, setup, delivery } = req.body;

            if( !category || !setup || !delivery ) {
                return res.status(400).json({ error: 'Missing required paramters: category, setup, delivery'});

            }

            const updateJokes = await JokeModel.addJoke(category, setup, delivery);
            res.json(updateJokes);
         } catch (err) {
            res.status(500).json({ error: err.message});
         }
    }


};

module.exports = JokeController;