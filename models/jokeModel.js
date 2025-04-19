const db = require('../database');

const JokeModel = {

    getCategories: () => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT name FROM categories`, (err, rows) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(rows.map(row => row.name));
            });
        });
    },


    getJokesByCategory: (category, limit=null) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT id FROM categories WHERE name = ?`, [category], (err, categoryRow) => {
                if(err) {
                    reject(err);
                    return;
                }
                if(!categoryRow) {
                    reject(new Error('Category not found'));
                    return;
                }

                let query = `SELECT setup, delivery FROM jokes WHERE category_id = ?`;
                let params = [categoryRow.id];

                if(limit) {
                    query += ' LIMIT ?';
                    params.push(limit);
                }

                db.all(query, params, (err, jokes) => {
                    if(err){
                        reject(err);
                        return;
                    }
                    resolve(jokes);
                });
            });
        });
    },

    //getting a random joke
    getRandomJoke: () => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT setup, delivery FROM jokes ORDER BY RANDOM() LIMIT 1`, (err,joke) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(joke);
            });
        });
    },


    //adding a new joke
    addJoke: (category, setup, delivery) => {
        return new Promise((resolve, reject) => {

            db.get(`SELECT id FROM categories WHERE name = ?`, [category], (err, categoryRow) => {
                if (err) {
                    reject(err);
                    return;
                }

                const addJokeWithCategoryId = (categoryId) => {
                    db.run(`INSERT INTO jokes (category_id, setup, delivery) VALUES (?,?,?)`,
                        [categoryId, setup, delivery], function(err) {
                            if(err) {
                                reject(err);
                                return;
                            }

                            JokeModel.getJokesByCategory(category).then(jokes => resolve(jokes)).catch(err => reject(err));
                        }
                    );
                };

                if (categoryRow) {
                    addJokeWithCategoryId(categoryRow.id);
                } else {
                    db.run(`INSERT INTO categories (name) VALUES (?)`, [category], function(err) {
                        if(err) {
                            reject(err);
                            return;
                        }
                        addJokeWithCategoryId(this.lastID);
                    });
                }
            

            });
        });
    }
};

module.exports = JokeModel;