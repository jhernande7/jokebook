/* <!--
  Name: Jonathan Hernandez-Cardenas
  Date: 04.18.2025
  CSC 372-01

  This is the Database creation file and connection for jokebook
--> */
const sqlite3 = require('sqlite3').verbose();

//creating a new database
const db = new sqlite3.Database('./jokebook.db');

//initialize the database 
const initDb = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE)`
        );


        //creates jokes table
        db.run(`CREATE TABLE IF NOT EXISTS jokes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER,
            setup TEXT,
            delivery TEXT,
            FOREIGN KEY (category_id) REFERENCES categories (id) )`
        );

        // Check for categories exist
        db.get(`SELECT COUNT(*) as count FROM categories`, (err, row) => {
            if (err) {
                console.error(err.message);
                return;
            }


            //if no category exist, insert data
            if (row.count === 0) {
                const categories = ['funnyJoke', 'lameJoke'];
                const insertCategory = db.prepare(`INSERT INTO categories (name) VALUES (?)`);

                categories.forEach(category => {
                    insertCategory.run(category, function (err) {
                        if (err) {
                            console.error('Error in inserting category');
                            return;
                        }

                        const categoryId = this.lastID;
                        let jokes = [];

                        //assing jokes 
                        if (category === 'funnyJoke') {
                            jokes = [
                                {
                                    setup: 'Why did the student eat his homework?',
                                    delivery: 'Becuase the teacher told him it was a piece of cake!'
                                },
                                {
                                    setup: 'What kind of tree fits in your hand?',
                                    delivery: 'a palm tree'
                                },
                                {
                                    setup: 'what is worse than raining cats and dogs?',
                                    delivery: 'hailing taxis!'
                                }
                            ];
                        } else if (category === 'lameJoke') {
                            jokes = [
                                {
                                    setup: 'Which bear is the most condescending?',
                                    delivery: 'Pan-DUH'
                                },
                                {
                                    setup: 'What would the Terminator be called in his retirement?',
                                    delivery: 'The Exterminator'
                                }
                            ];
                        }

                        //insert the jokes
                        const insertJoke = db.prepare(`INSERT INTO jokes (category_id, setup, delivery) VALUES (?, ?, ?)`);
                        jokes.forEach(joke => {
                            insertJoke.run(categoryId, joke.setup, joke.delivery, function (err) {
                                if (err) {
                                    console.error(`Error inserting jokes`);
                                }
                            });
                        });
                        insertJoke.finalize();
                    });
                });
                insertCategory.finalize();
            }
        });
    });
};

//initialize database
initDb();

module.exports = db;