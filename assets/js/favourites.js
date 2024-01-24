// Function to generate HTML for each cocktail card
function generateCocktailCard(data, dataInstructions ) {
    console.log(data)
    return `<div class="col-lg-4 col-md-6 col-sm-12 mb-4">
        <div class="card">
            <div class="card-body">
                <h2 class="card-title">${data}</h2>
                <p class="card-text">How to make: ${dataInstructions}</p>
                <p class="card-text">Type: ${data.strAlcoholic}</p>
                <p class="card-text">Food: ${data.title}</p>
                <img src=${data.image} alt="Meal Icon" class="img-fluid">

            </div>
        </div>
    </div>`;
}

// Update the displayLikedCocktails function
function displayLikedCocktails() {
    // Retrieve liked cocktails from local storage
    const likedCocktails = JSON.parse(localStorage.getItem('likedCocktails')) || [];
        console.log(likedCocktails)
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
