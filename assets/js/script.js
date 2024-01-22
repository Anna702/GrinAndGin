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

//Function to get random elements from drinks array (that we got from API call)
function getRandomElements(array, count) {
  const arrayLength = array.length;
  let randomIndices = [];

  if (count > arrayLength) {
    // If the requested count is more than the array length, return the entire array
    return array;
  }

  while (randomIndices.length < count) {
    const randomIndex = Math.floor(Math.random() * arrayLength);

    // Check if the index is not already selected
    if (randomIndices.indexOf(randomIndex) === -1) {
      randomIndices.push(randomIndex);
    }
  }

  // Map the random indices to corresponding array elements
  const randomElements = randomIndices.map(function (index) {
    return array[index];
  });

  return randomElements;
}


// Function to search for a drink by ingredient
function searchDrink(drink) {
  //Search By INGREDIENT
  let queryUrl = `http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${drink}`;

  $.getJSON(queryUrl)
    .done(function (data) {
      console.log(data.drinks);
      let listOfDrinks = getRandomElements(data.drinks, 9);
      console.log(listOfDrinks);
    })
    .fail(function (data) {
      console.log(data);
      alert("Could not find any drink with this ingredient");
    });

  return;
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
          cocktailRecipe = data.drinks[0].strInstructions; //it is an instruction
          drinkCard(data, cocktailRecipe);
        });
    });
}

// Function to display drinks on the page
function drinkCard(data, cocktailRecipe) {
  // Retrieving the URL for the image
  console.log(data);
  const name = data.drinks[0].strDrink;
  const imgURL = data.drinks[0].strDrinkThumb;
  const alcoOrNot = data.drinks[0].strAlcoholic;

  const card = `
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">${name}</h2>
              <img src=${imgURL} alt="Cocktail Icon">
              <p class="card-text">How to make : ${cocktailRecipe}</p>
              <p class="card-text">Type: ${alcoOrNot}</p>
            </div>
          </div>
        `;

  $("#container").html(card);
}

// Event handler for MixIt button
$("#searchButton").on("click", function (event) {
  // Preventing propagation of the event
  event.stopImmediatePropagation();

  // Storing the drink name insert by the user
  const inputDrink = $("#ingredients").val().trim();

  // Get the selected alco value from the dropdown menu
  // const selectedType = $("#alcoholType").val().trim();
  // console.log(selectedType);

  //throw an error if user input cocktail name is empty
  if (!inputDrink) {
    console.error("Please enter any ingredient.");
    return;
  }
  // Adding drink from the textbox to our array of drinks search
  searchDrink(inputDrink);
});
