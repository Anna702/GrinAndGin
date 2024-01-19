// Check if localStorage already has search history and liked recipes- initiate when rendering

// Function to render search history and liked recipes
// Code to render search history and liked recipes on the webpage

// Function to fetch cocktail data from CocktailDB API
// Code to make API request to CocktailDB based on ingredient and non-alcoholic/Alcoholic
// Parse and return relevant cocktail data

// Function to fetch food suggestion from a second API
// Code to make API request for food suggestion
// Parse and return relevant food data

// Function to display results on the webpage

// Event listener for the search button
// Research async/await
// Fetch cocktail data and food suggestion
// Display results on the webpage
// Save search to search history
// Render updated search history on the webpage

// Event listener for like/dislike buttons
// Code to handle liked recipes
// Update liked recipes array and save to local storage
// Render updated liked recipes on the webpage
// Code to handle disliking a recipe

// Initial array of drinks
const drinks = [];

function searchDrink(drink, alc) {
  //Search By INGREDIENT
  let queryUrl = `http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${drink}`;

  //Search by NAME
  // const queryUrl = `http://www.thecocktaildb.com/api/json/v1/1/search.php?i=${drink}`;

  //Search cocktail by NAME: MARGARITA, MOJITO
  //we get (name,icon,alcoholic/non alcoholic, instructions, glass type, ingredients, measures...)
  // const queryUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`;

  fetch(queryUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      //creating a new URL for the second API call - with coctail name
      queryUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${data.drinks[0].strDrink}`;
      console.log(data.drinks[0].strDrink);
      fetch(queryUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data.drinks[0].strInstructions); //it is an instruction
          coctailRecipe = data.drinks[0].strInstructions;
          drinkCard(data, coctailRecipe);
        });
    });
}
// Function to display drinks on the page
function drinkCard(data, coctailRecipe) {
  // Retrieving the URL for the image
  const name = data.drinks[0].strDrink;
  console.log(name);
  const imgURL = data.drinks[0].strDrinkThumb;

  // Creating an element to hold the image
  const image = $("<img>").attr("src", imgURL);
  // Creating an element to hold the recipe
  const recipeEl = $("<div>").text(`How to make it: ${coctailRecipe}`);

  const card = `
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">${data.drinks[0].strDrink}</h2>
        
              <img src=${data.drinks[0].strDrinkThumb} alt="Cocktail Icon">
              <p class="card-text">How to make : ${coctailRecipe}</p>
              <p class="card-text">Type: ${data.drinks[0].strAlcoholic}</p>
           
             
            </div>
          </div>
        `;

  $("#container").html(card);
}

// Event handler for user clicking the search drink button
$("#searchButton").on("click", function (event) {
  // Preventing the button from trying to submit the form
  event.preventDefault();
  // Storing the drink name insert by the user
  const inputDrink = $("#ingredients").val().trim();
  //Storing if the user wants an alcoholic/non alcoholic options
  const alcoholic = $("#alcoholType").val().trim();
  console.log(inputDrink);
  console.log(alcoholic);

  //user input cocktail name is empty nothing happend
  if (inputDrink == "") {
    return;
  } else {
    // Adding drink from the textbox to our array of drinks search
    drinks.push(inputDrink);
    console.log(drinks);
    // Calling renderDrinks which handles the processing of our drinks array
    //

    // Running the searchDrink function(passing in the drink as an argument)
    // searchDrink(inputDrink);
    searchDrink(inputDrink, alcoholic);
  }
});
