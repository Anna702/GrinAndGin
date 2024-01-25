// Initial array of drinks
var drinks = [];
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

//// Bootstrap Modal to show message to the user if there isn't any cocktail that meet user's requirements
function modalMessage() {
  const messageModal = `


<div class="modal fade" id="messageModal" tabindex="-1" role="dialog" aria-labelledby="messageModalTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Message</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"> &times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>There are 0 cocktails found with that criteria.</p>
        <p>Let's search again!</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

`;

  // Append the modal to the body
  $("body").append(messageModal);
}

//// Bootstrap Modal to show message to the user if there isn't any cocktail return by API call
function modalMessage1() {
  const messageModal1 = `


<div class="modal fade" id="messageModal1" tabindex="-1" role="dialog" aria-labelledby="messageModalTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Message</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"> &times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p></p>
        <p>Please enter any ingredient!</p>
        <p>Let's search again!</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

`;

  // Append the modal to the body
  $("body").append(messageModal1);
}

//// Bootstrap Modal to show message to the user if they like a cocktail
function modalMessageLike(name) {
  const messageModalLike = `


<div class="modal fade" id="messageModalLike" tabindex="-1" role="dialog" aria-labelledby="messageModalTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Message</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true"> &times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p></p>
        <p>You liked the cocktail: ${name}</p>
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

`;

  // Append the modal to the body
  $("body").append(messageModalLike);
}

// Function to search for a drink by ingredient
function searchDrink(drink, alcoholic) {
  //Search By INGREDIENT
  // let queryUrl = `http://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${drink}`;

  //Search cocktail by NAME
  //we get (name,icon,alcoholic/non alcoholic, instructions, glass type, ingredients, measures...)
  var queryUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${drink}`;

  $.getJSON(queryUrl)
    //getJSON is always async,
    .done(function (data) {
      //if we don't found any cocktail --show a modal telling that to the user
      if (data.drinks === null) {
        $(document).ready(function () {
          modalMessage();
          $("#messageModal").modal();
        });
      } else {
        let listOfDrinks = getRandomElements(data.drinks, 9); //this is our array of displayed drinks (if we need more/less to display - just change a number)

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
              const alcoOrNot = dataInstructions.drinks[0].strAlcoholic; //it is a drink type

              //filter by alcoholic/non alcoholic options given by user input
              if (dataInstructions.drinks[0].strAlcoholic === alcoholic) {
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
                    }
                    //else - get a random recipe with an input ingredient in it and attach it to the card
                    else {
                      const differentMatchingMeals = getRandomElements(
                        foodData.meals,
                        1
                      );
                      // Loop through each meal in differentMatchingMeals
                      for (let j = 0; j < differentMatchingMeals.length; j++) {
                        const mealName = differentMatchingMeals[j].strMeal;
                        const mealImage =
                          differentMatchingMeals[j].strMealThumb;

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
              } //if
            },
          });
        } //for

        if (cardsHtml.trim().length !== 0) {
          // Set the accumulated HTML content to #container
          $("#container").html(cardsHtml);
        }
        //if we don't find any cocktail --show a modal telling that to the user
        else {
          $(document).ready(function () {
            modalMessage();
            $("#messageModal").modal();
          });
        }
      }
    })
    .fail(function (data) {
      //alert("Could not find any drink with this ingredient");
      $(document).ready(function () {
        modalMessage();
        $("#messageModal").modal();
      });
    });
}

// Function to display drinks cards on the page
function drinkCard(data, howToMake, alcoOrNot, mealName, mealImage) {
  const name = data.strDrink;
  const imgURL = data.strDrinkThumb;

  const card = `
  <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
    <div class="card">
      <div class="card-body">
      <div class="backCardStyle">
        <h2 class="card-title">${name}</h2>
        <p class="card-text">${alcoOrNot}</p>
        </div>
        <img src=${imgURL} alt="Cocktail Icon" class="img-fluid">
        
        <h5 class="card-text howToMixText card-text-center">How to mix :</h5>
        <p class="pTextCardsSearch">${howToMake}</p>

        <h4 class="card-text card-text-center">Ingredients: </h4>
        <table class="table table-bordered">
            <tbody>
                ${createIngredientRow(data.strIngredient1, data.strMeasure1)}
                ${createIngredientRow(data.strIngredient2, data.strMeasure2)}
                ${createIngredientRow(data.strIngredient3, data.strMeasure3)}
                ${createIngredientRow(data.strIngredient4, data.strMeasure4)}
            </tbody>
        </table>

        <h5 class="card-text howToMixText card-text-center">Try it with:</h5>
        <p class="text-center card-title">${mealName}</p>

          <img src=${mealImage} alt="Meal Image" class="img-fluid">
          <button class="btn btn-primary like-button"
            data-cocktail-name="${name}"
            data-how-to-make="${howToMake}"
            data-alco-or-not="${alcoOrNot}"
            data-meal-name="${mealName}"
            data-meal-image="${mealImage}"
            data-img-url="${imgURL}"
            data-ing1="${data.strIngredient1} - ${data.strMeasure1}" 
            data-ing2="${data.strIngredient2} - ${data.strMeasure2}"  
            data-ing3="${data.strIngredient3} - ${data.strMeasure3}"  
            data-ing4="${data.strIngredient4} - ${data.strMeasure4}"  

              <button class="btn btn-primary like-button" data-cocktail-name="${name}">Add to favourites</button>
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

  //Storing if the user wants an alcoholic/non alcoholic options
  const alcoholic = $("#alcoholType").val().trim();

  //throw an error if user input cocktail name is empty
  if (!inputDrink) {
    $(document).ready(function () {
      modalMessage1();
      $("#messageModal1").modal();
    });
    return;
  }

  // Adding drink from the textbox to our array of drinks search
  drinks.push(inputDrink);

  // Adding drink from the textbox to our array of drinks search
  searchDrink(inputDrink, alcoholic);
});

// Created an event for handling "Like" button click and saving it in local storage
$("#container").on("click", ".like-button", function () {
  const cocktailData = {
    name: $(this).data("cocktail-name"),
    howToMake: $(this).data("how-to-make"),
    alcoOrNot: $(this).data("alco-or-not"),
    mealName: $(this).data("meal-name"),
    mealImage: $(this).data("meal-image"),
    imgURL: $(this).data("img-url"),
    ingredients: [
      $(this).data("ing1"),
      $(this).data("ing2"),
      $(this).data("ing3"),
      $(this).data("ing4"),
    ],
  };

  const likedCocktails =
    JSON.parse(localStorage.getItem("likedCocktails")) || [];

  // First check if the cocktail is already liked
  if (!likedCocktails.some((cocktail) => cocktail.name === cocktailData.name)) {
    likedCocktails.push(cocktailData);
    localStorage.setItem("likedCocktails", JSON.stringify(likedCocktails));

    //alert(`You liked the cocktail: ${cocktailData.name}`);
    $(document).ready(function () {
      modalMessageLike(`${cocktailData.name}`);
      $("#messageModalLike").modal();
    });
  } else {
    // Now checking if it's the second click on the same recipe
    const clickCount = $(this).data("click-count") || 0;

    if (clickCount === 1) {
      // Display alert for a repeat like, only on the second click
      alert(`You already liked the cocktail: ${cocktailData.name}`);
    }

    // Code to update the click count
    $(this).data("click-count", clickCount + 1);
  }
});

function createIngredientRow(ingredient, measure) {
  // check if we have data (not empty)
  if (ingredient && measure) {
    return `
          <tr>
              <td>${ingredient}</td>
              <td>${measure}</td>
          </tr>
      `;
  }
  return "";
}
