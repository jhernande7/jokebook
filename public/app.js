/* <!--
  Name: Jonathan Hernandez-Cardenas
  Date: 04.18.2025
  CSC 372-01

  This is the javascript junctionality file for index.html
--> */

// creating dom elements
const randomSetup = document.getElementById('random-setup');
const randomDelivery = document.getElementById('random-delivery');
const getRandomJokeBtn = document.getElementById('get-random-joke');
const categoriesList = document.getElementById('categories-list');
const categorySearch = document.getElementById('category-search');
const categorybtn = document.getElementById('search-btn');
const jokesSection = document.getElementById('jokes-section');
const currentCategory = document.getElementById('current-category');
const jokesList = document.getElementById('jokes-list');
const jokeForm = document.getElementById('joke-form');
const jokeCategory = document.getElementById('joke-category');
const jokeSetup = document.getElementById('joke-setup');
const jokeDelivery = document.getElementById('joke-delivery');
const formMessage = document.getElementById('form-message');

// api urls that are used for endpoints
const API_URL = '/jokebook';
const CATEGORIES_URL = `${API_URL}/categories`;
const CATEGORY_JOKES_URL = `${API_URL}/joke`;
const RANDOM_JOKE_URL = `${API_URL}/random`;
const ADD_JOKE_URL = `${API_URL}/joke/add`;

// functions that will handle when either of these are called
const fetchData = async(url, options = {}) => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error recieving data');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error: ', error);
        throw error;
    }
};

//displaying random joke on landing page
const displayRandomJoke = async () => {
    try {
        const joke = await fetchData(RANDOM_JOKE_URL);
        randomSetup.textContent = joke.setup;
        randomDelivery.textContent = joke.delivery;
    } catch (error) {
        randomSetup.textContent = 'Error loading joke.';
        randomDelivery.textContent = error.message;
    }
};


const loadCategories = async () => {
    try {
        const categories = await fetchData(CATEGORIES_URL);
        categoriesList.textContent = '';

        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'category-btn';
            button.textContent = category;

            button.addEventListener('click', function() {
                loadJokesByCategory(category);
            });

            categoriesList.appendChild(button);
        });

        
    } catch (error) {
        const errorPara = document.createElement('p');
        errorPara.className = 'error-message';
        errorPara.textContent = 'Error loading categories';

        categoriesList.textContent = '';
        categoriesList.appendChild(errorPara);
    }
};


const loadJokesByCategory = async (category) => {
    try {
        const jokes = await fetchData(`${CATEGORY_JOKES_URL}/${category}`);

        currentCategory.textContent = category;
        jokesList.textContent = '';

        jokes.forEach(joke => {
            const jokeItem = document.createElement('div');
            jokeItem.className = 'joke-item';

            const setupPara = document.createElement('p');
            setupPara.textContent = joke.setup;

            const deliveryPara = document.createElement('p');
            deliveryPara.className= 'delivery';
            deliveryPara.textContent = joke.delivery;


            jokeItem.appendChild(setupPara);
            jokeItem.appendChild(deliveryPara);

            jokesList.appendChild(jokeItem);
        
        });

        jokesSection.classList.remove('hidden');
        jokeCategory.value = category;
    } catch (error) {
        const errorPara = document.createElement('p');
        errorPara.className= 'error-message';
        errorPara.textContent= 'Error loading jokes';

        jokesList.textContent = '';
        jokesList.appendChild(errorPara);
        jokesSection.classList.remove('hidden');
    }
};


const searchCategory = () => {
    const category = categorySearch.value.trim();
    if(category) {
        loadJokesByCategory(category);
    }
};


const addNewJoke = async (event) => {
    event.preventDefault();

    const category = jokeCategory.value.trim();
    const setup = jokeSetup.value.trim();
    const delivery = jokeDelivery.value.trim();

    if (!category || !setup || !delivery) {
        formMessage.textContent = 'All fileds are required.';
        formMessage.className = 'error-message';
        return;
    }

    try  {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category, setup, delivery })
        };

        await fetchData(ADD_JOKE_URL, options);

        formMessage.textContent = 'Joke added successfully!';
        formMessage.className = 'success-message';

        //reset form
        jokeSetup.value = '';
        jokeDelivery.value = '';

        loadJokesByCategory(category);

        loadCategories();
    } catch (error) {
        formMessage.textContent = 'Error adding joke';
        formMessage.className = 'error-message';
    }
};


//event listeners
document.addEventListener('DOMContentLoaded', () => {
    displayRandomJoke();
    loadCategories();

    //adding event lisenters
    if(getRandomJokeBtn){
        getRandomJokeBtn.addEventListener('click', displayRandomJoke);
    } else {
        console.error('getRandomJokeBtn element not found in DOM');
    }

    if(categorybtn){
        categorybtn.addEventListener('click', searchCategory);
    } else {
        console.error('categoryBtn element not found in DOM');
    }

    if(categorySearch){
        categorySearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchCategory();
            }
        });
    } else {
        console.error('CategorySearch element not found in DOM');
    }

    if(jokeForm){
        jokeForm.addEventListener('submit', addNewJoke);
    } else {
        console.error('JokeForm element not found in DOM');
    }

});






