getAllCocktails(25); // Pass the desired count of cards displayed on the page

function getAllCocktails(cardCount) {
  let cardsHtml = ""; // Accumulate HTML content for each cocktail card

  for (let i = 0; i < cardCount; i++) {
    let randomCocktailQueryUrl = `https://www.thecocktaildb.com/api/json/v1/1/random.php`;

    $.getJSON(randomCocktailQueryUrl)
      .done(function (cocktailData) {
        cardsHtml += cocktailCard(cocktailData.drinks[0], i); // Pass 'i' to make each modal unique

        // Set the accumulated HTML content to #container
        $("#cocktailsContainer").html(cardsHtml);
      })
      .fail(function (data) {
        console.log(data, "Cocktails data problems - check the code");
      });
  }
}

// Function to display food cards on the page
function cocktailCard(cocktailData, index) {
  const cocktailName = cocktailData.strDrink;
  const cocktailImage = cocktailData.strDrinkThumb;
  const cocktailType = cocktailData.strAlcoholic;

  const ingredients = getIngredients(cocktailData);

  const card = `
    <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${cocktailName}</h5>
        <p class="card-text">Type: ${cocktailType}</p>
        <img src="${cocktailImage}" alt="Cocktail image" class="img-fluid foodCard-img">
        <button class="btn btn-cook" data-toggle="modal" data-target="#recipeModal${index}" mx-auto mt-2">Mix It!</button>
      </div>
    </div>
  </div>
    `;
  modalCocktail(cocktailData, ingredients, index);
  return card;
}

// Function to get all ingredients from the cocktail data
function getIngredients(cocktailData) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = cocktailData[`strIngredient${i}`];
    const measure = cocktailData[`strMeasure${i}`];
    if (ingredient && measure) {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }
  return ingredients;
}

// Bootstrap Modal for Recipe Details
function modalCocktail(cocktailData, ingredients, index) {
  const recipeModal = `
        <div class="modal fade" id="recipeModal${index}" tabindex="-1" role="dialog" aria-labelledby="recipeModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header text-white">
                <h4 class="modal-title" id="recipeModalLabel">${
                  cocktailData.strDrink
                }</h4>
                <p class="card-text"> ${cocktailData.strAlcoholic}</p>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-6">
                    <img src="${
                      cocktailData.strDrinkThumb
                    }" alt="Meal Icon" class="img-fluid" id="modalMealImage">
                  </div>
                  <div class="col-md-6">
                    <h6 class="ingredientsModal">Ingredients:</h6>
                    <ul class="list-group">
                      ${ingredients
                        .map(
                          (ingredient) =>
                            `<li class="list-group-item">${ingredient}</li>`
                        )
                        .join("")}
                    </ul>
                  </div>
                </div>
                <hr class="my-4">
                <h6 class="ingredientsModal">How to cook it:</h6>
                <p>${cocktailData.strInstructions}</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      `;
  // Append the modal to the body
  $("body").append(recipeModal);
}
