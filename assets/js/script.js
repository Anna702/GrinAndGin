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
    // If the requested number of drinks is more than the array length, return the entire array
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
    //getJSON is always async,
    .done(function (data) {
      console.log(data.drinks);
      let listOfDrinks = getRandomElements(data.drinks, 9); //this is our array of displayed drinks (if we need more/less to display - just change a number)
      console.log(listOfDrinks);

      //creating a new query URL for the second API call - with coctail names
      let cardsHtml = ""; // Accumulate HTML content for each cocktail card

      for (let i = 0; i < listOfDrinks.length; i++) {
        const secondQueryUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${listOfDrinks[i].strDrink}`;
        //getJSON is always async, thay is why here we use ajax - to wait for an answer from API before going further
        $.ajax({
          type: "GET",
          async: false,
          url: secondQueryUrl,
          // contentType: "application/json",
          dataType: "json",
          success: function (dataInstructions) {
            const howToMake = dataInstructions.drinks[0].strInstructions; //it is an instruction how to make a cocktail
            console.log(howToMake);
            const alcoOrNot = dataInstructions.drinks[0].strAlcoholic; //it is a drink type
            console.log(alcoOrNot);

            //add 3rd queryURL
            //The meal DB API - search based on the user input ingredient
            let foodQueryUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${drink}`;

            $.ajax({
              type: "GET",
              async: false,
              url: foodQueryUrl,
              dataType: "json",
              success: function (foodData) {
                //if there is no meals with ingredient - use API for a random meal
                if (foodData.meals === null) {
                  let foodQueryUrl = `https://www.themealdb.com/api/json/v1/1/random.php`;

                  $.ajax({
                    type: "GET",
                    async: false,
                    url: foodQueryUrl,
                    dataType: "json",
                    success: function (foodData) {
                      const mealName = foodData.meals[0].strMeal;
                      const mealImage = foodData.meals[0].strMealThumb;

                      cardsHtml += drinkCard(
                        listOfDrinks[i],
                        howToMake,
                        alcoOrNot,
                        mealName,
                        mealImage
                      );
                    },
                  });
                  //else - get a random recipe with an input ingredient in it and attach it to the card
                } else {
                  const differentMatchingMeals = getRandomElements(
                    foodData.meals,
                    1
                  );
                  // Loop through each meal in differentMatchingMeals
                  for (let j = 0; j < differentMatchingMeals.length; j++) {
                    const mealName = differentMatchingMeals[j].strMeal;
                    const mealImage = differentMatchingMeals[j].strMealThumb;

                    // Add cocktail name and recipe to cardsHtml
                    cardsHtml += drinkCard(
                      listOfDrinks[i],
                      howToMake,
                      alcoOrNot,
                      mealName,
                      mealImage
                    );
                  }
                }
              },
            });
          },
        });
      }
      // Set the accumulated HTML content to #container
      $("#container").html(cardsHtml);
    })
    .fail(function (data) {
      console.log(data);
      alert("Could not find any drink with this ingredient");
    });
}

// Function to display drinks on the page
function drinkCard(data, howToMake, alcoOrNot, mealName, mealImage) {
  console.log(mealName);
  // Retrieving the URL for the image
  const name = data.strDrink;
  const imgURL = data.strDrinkThumb;

  const card = `
  <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
          <div class="card">
            <div class="card-body">
              <h2 class="card-title">${name}</h2>
              <img src=${imgURL} alt="Cocktail Icon" class="img-fluid">
              <p class="card-text">How to make : ${howToMake}</p>
              <p class="card-text">Type: ${alcoOrNot}</p>
              <p class="card-text">Food: ${mealName}</p>
              <img src=${mealImage} alt="Meal Icon" class="img-fluid">
            </div>
          </div>
  </div>
        `;
  return card;
}

// Event handler for MixIt button
$("#searchButton").on("click", function (event) {
  // Preventing propagation of the event
  event.stopImmediatePropagation();

  // Storing the drink name insert by the user
  const inputDrink = $("#ingredients").val().trim();

  //throw an error if user input cocktail name is empty
  if (!inputDrink) {
    console.error("Please enter any ingredient!");
    return;
  }
  // Adding drink from the textbox to our array of drinks search
  searchDrink(inputDrink);
});
