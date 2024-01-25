
// Function to generate HTML for each cocktail card
function generateCocktailCard(cocktail) {
    // console.log(cocktail); 

    // Convert ingredients array to HTML list items
    // const ingredientsList = cocktail.ingredients.join(', ');

    return `<div class="col-lg-4 col-md-6 col-sm-12 mb-4">
        <div class="card">
            <div class="card-body">
                <h2 class="card-title">${cocktail.name}</h2>
                <p class="card-text">Type: ${cocktail.alcoOrNot}</p>
                <img src=${cocktail.imgURL} alt="Meal Icon" class="img-fluid">
                <p class="card-text">How to make: ${cocktail.howToMake}</p>
                <h5 class="card-title">Ingredients</h5>
                <ul>${cocktail.ingredients}</ul>
                <p class="card-text">Food: ${cocktail.mealName}</p>
                <img src=${cocktail.mealImage} alt="Meal Icon" class="img-fluid">
                <button class="btn btn-danger unlike-button" data-cocktail-name="${cocktail.name}">Unlike</button>
            </div>
        </div>
    </div>`;
}

// Create event handler for Unlike button
$("#favoritesContainer").on("click", ".unlike-button", function () {
    const cocktailName = $(this).data("cocktail-name");

    // Retrieve liked cocktails from local storage
    let likedCocktails = JSON.parse(localStorage.getItem('likedCocktails')) || [];

    // Filter out the cocktail to be removed
    likedCocktails = likedCocktails.filter(cocktail => cocktail.name !== cocktailName);

    // Update local storage
    localStorage.setItem("likedCocktails", JSON.stringify(likedCocktails));

    // Re-display liked cocktails
    displayLikedCocktails();

});

// Update the displayLikedCocktails function
function displayLikedCocktails() {
    // Retrieve liked cocktails from local storage
    const likedCocktails = JSON.parse(localStorage.getItem('likedCocktails')) || [];

    // Display liked cocktails on the page
    const favoritesContainer = $("#favoritesContainer");

    if (likedCocktails.length > 0) {
        let likedHtml = '';

        likedCocktails.forEach(cocktail => {
            likedHtml += generateCocktailCard(cocktail);
        });

        // Display the produced list to the container on the Favorites page
        favoritesContainer.html(likedHtml);
    } else {
        // Display a message if there are no liked cocktails
        favoritesContainer.html("<p>No liked cocktails yet!</p>");
    }
}

// Call the displayLikedCocktails function when the Favorites page loads
$(document).ready(function () {
    displayLikedCocktails();
});