// Function to display liked cocktails on the Favorites page
function displayLikedCocktails() {
    // Retrieve liked cocktails from local storage
    const likedCocktails = JSON.parse(localStorage.getItem('likedCocktails')) || [];
  
    // Display liked cocktails on the page
    const favoritesContainer = $("#favoritesContainer");
  
    if (likedCocktails.length > 0) {
      let likedHtml = '';
  
      likedCocktails.forEach((cocktailName) => {
        likedHtml += `<p>${cocktailName}</p>`;
      });
  
      // display the produced list to the container on the Favorites page
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
