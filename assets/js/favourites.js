// Create function to display liked cocktails on the page
function displayLikedCocktails() {
    const likedCocktails = JSON.parse(localStorage.getItem("likedCocktails")) || [];
  
    // Checking for any liked cocktails in localStorage
    if (likedCocktails.length > 0) {
      const likedList = document.createElement("ul");
      console.log(likedList)

      // Loop through liked cocktails and create list items
      likedCocktails.forEach(function (cocktail) {
        const listItem = document.createElement("li");
        listItem.textContent = cocktail;
        likedList.appendChild(listItem);
        console.log(likedList)
      });
  

    }
  }
  
  // Call the function to display liked cocktails
  
    displayLikedCocktails();
  
  
  
    