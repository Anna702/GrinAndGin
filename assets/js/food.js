getAllFood(45); // Pass the desired count of cards displayed on the page

function getAllFood(cardCount) {
  let cardsHtml = ""; // Accumulate HTML content for each food card

  for (let i = 0; i < cardCount; i++) {
    let randomFoodQueryUrl = `https://www.themealdb.com/api/json/v1/1/random.php`;

    $.getJSON(randomFoodQueryUrl)
      .done(function (foodData) {
        cardsHtml += foodCard(foodData.meals[0], i); // Pass 'i' to make each modal unique

        // Set the accumulated HTML content to #container
        $("#foodContainer").html(cardsHtml);
      })
      .fail(function (data) {
        console.log(data);
        alert("Food problems - check the code");
      });
  }
}

// Function to display food cards on the page
function foodCard(mealData, index) {
  console.log(mealData);
  const mealName = mealData.strMeal;
  const mealImage = mealData.strMealThumb;
  const ingredients = getIngredients(mealData);

  const card = `
    <div class="col-lg-4 col-md-6 col-sm-12 mb-4">
      <div class="card">
        <div class="card-body">
          <p class="card-title">${mealName}</p>
          <img src="${mealImage}" alt="Meal Icon" class="img-fluid">
          <button class="btn btn-primary" data-toggle="modal" data-target="#recipeModal${index}">Cook It!</button>
        </div>
      </div>
    </div>
  `;
  modalFood(mealData, ingredients, index);
  return card;
}

// Function to get all ingredients from the meal data
function getIngredients(mealData) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = mealData[`strIngredient${i}`];
    const measure = mealData[`strMeasure${i}`];
    if (ingredient && measure) {
      ingredients.push(`${measure} ${ingredient}`);
    }
  }
  return ingredients;
}

// Bootstrap Modal for Recipe Details
function modalFood(mealData, ingredients, index) {
  console.log(mealData);
  const recipeModal = `
      <div class="modal fade" id="recipeModal${index}" tabindex="-1" role="dialog" aria-labelledby="recipeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="recipeModalLabel">${
                mealData.strMeal
              }</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" class="text-white">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <img src="${
                    mealData.strMealThumb
                  }" alt="Meal Icon" class="img-fluid" id="modalMealImage">
                </div>
                <div class="col-md-6">
                  <h6 class="mb-3">Ingredients:</h6>
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
              <h6 class="mb-3">How to cook it:</h6>
              <p>${mealData.strInstructions}</p>
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
