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
var drinks = [];

// Function to search for a drink by ingredient
function searchDrink(drink, alc) {
  //Search By INGREDIENT
  let queryUrl;

  //check the alco/non-user-input
  if (alc === "alcoholic") {
    // Search By INGREDIENT for alcoholic drinks
    queryUrl = `http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${drink}&a=Alcoholic`;
  } else if (alc === "non-alcoholic") {
    // Search By INGREDIENT for non-alcoholic drinks
    queryUrl = `http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${drink}&a=Non_Alcoholic`;
  }

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
          cocktailRecipe = data.drinks[0].strInstructions;
          drinkCard(data, cocktailRecipe);
        });
    });
}

// Function to display drinks on the page
function drinkCard(data, cocktailRecipe) {
  // Retrieving the URL for the image
  const name = data.drinks[0].strDrink;
  console.log(name);
  const imgURL = data.drinks[0].strDrinkThumb;

  const card = `
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">${data.drinks[0].strDrink}</h2>
        
              <img src=${imgURL} alt="Cocktail Icon">
              <p class="card-text">How to make : ${cocktailRecipe}</p>
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

  // Get the selected alco value from the dropdown menu
  const selectedType = $("#alcoholType").val().trim();
  console.log(selectedType);

  //throw an error if user input cocktail name is empty
  if (!inputDrink) {
    console.error("Please enter any ingredient.");
    return;
  } else {
    // Adding drink from the textbox to our array of drinks search
    drinks.push(inputDrink);
    console.log(drinks);
    searchDrink(inputDrink, selectedType);
  }
});
