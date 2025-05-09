let appid = "e3a1b036";
let appkey = "f60e24640d23721fbb78d3e2d74d121e";
let baseurl = "https://api.edamam.com/api/recipes/v2?type=public&q=";
let userid = "NaveenGairuboina";

let searchInput = document.getElementById("search-bar");
let searchButton = document.getElementById("search-btn");
let featuredImage = document.getElementById("featured-image");
let featuredName = document.getElementById("featured-name");
let featuredDescription = document.getElementById("featured-description");
let featuredIngredients = document.getElementById("featured-ingredients");
let recipesGrid = document.getElementById("recipes-grid");
let favFeaturedBtn = document.getElementById("fav-featured-btn");
let favoritesGrid = document.getElementById("favorites-grid");

let currentFeaturedRecipe = null;

// Load favorites from localStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Event listener for search
searchButton.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (!query) return;
  await recipeData(query);
});

// Fetch recipe data
async function recipeData(query) {
  const url = `${baseurl}${encodeURIComponent(query)}&app_id=${appid}&app_key=${appkey}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        "Edamam-Account-User": userid
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    displayResults(data.hits);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    recipesGrid.innerHTML = "<p>Failed to load recipes. Please try again.</p>";
  }
}

// Display recipes
function displayResults(recipes) {
  recipesGrid.innerHTML = "";
  featuredIngredients.innerHTML = "";

  if (!recipes.length) {
    recipesGrid.innerHTML = "<p>No recipes found.</p>";
    return;
  }

  // Featured
  const featured = recipes[0].recipe;
  currentFeaturedRecipe = featured;
  featuredImage.src = featured.image;
  featuredName.textContent = featured.label;
  featuredDescription.textContent = featured.source;
  featured.ingredients.forEach(ingredient => {
    let li = document.createElement("li");
    li.textContent = ingredient.text;
    featuredIngredients.appendChild(li);
  });

  // View button
  document.getElementById("view-featured-btn").onclick = () => {
    window.open(featured.url, "_blank");
  };

  // Favorite button for featured
  favFeaturedBtn.onclick = () => {
    addToFavorites(featured);
    alert("Added to favorites!");
  };

  // Other recipes
  recipes.slice(1).forEach(item => {
    const recipe = item.recipe;
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.label}" />
      <div id="re_title"><h3>${recipe.label}</h3></div>
      <p id="pa">
        <a id="view_btn" href="${recipe.url}" target="_blank">View Recipe</a>
        <button class="fav-btn" id="fav_btn" title="Add to Favorites"><i class="fas fa-heart"></i></button>
      </p>
    `;

    card.querySelector(".fav-btn").onclick = () => {
      addToFavorites(recipe);
    };

    recipesGrid.appendChild(card);
  });
}

// Add recipe to favorites
function addToFavorites(recipe) {
  if (favorites.find(fav => fav.uri === recipe.uri)) return;

  favorites.push(recipe);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

// Remove recipe from favorites
function removeFromFavorites(recipeUri) {
  favorites = favorites.filter(fav => fav.uri !== recipeUri);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
}

// Render favorites
function renderFavorites() {
  favoritesGrid.innerHTML = "";

  favorites.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "favorite-card";
    card.innerHTML = `
      <button class="remove-fav-btn" title="Remove">✖</button>
      <img src="${recipe.image}" alt="${recipe.label}" />
      <h4>${recipe.label}</h4>
      <p id="pa">
      <a id="view_btn" href="${recipe.url}" target="_blank">View Recipe</a></p>
    `;
    card.querySelector(".remove-fav-btn").onclick = () => {
      removeFromFavorites(recipe.uri);
    };
    favoritesGrid.appendChild(card);
  });
}

// Initial load
recipeData("payasam");
renderFavorites();
