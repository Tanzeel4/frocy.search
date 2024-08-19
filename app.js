document.addEventListener('DOMContentLoaded', () => {
    const recipeList = document.getElementById('recipeList');
    const recipeSearchBtn = document.getElementById('recipeSearchBtn');
    const recipeInput = document.getElementById('recipeInput');
    const recipeDetails = document.getElementById('recipeDetails');

    // Function to fetch the recipes based on search query
    const fetchRecipes = (query) => {
        fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`)
            .then(response => response.json())
            .then(data => {
                recipeList.innerHTML = '';
                const recipes = data.data.recipes;

                if (recipes.length === 0) {
                    recipeList.innerHTML = `<p>No recipes found for "${query}"</p>`;
                } else {
                    recipes.forEach(recipe => {
                        const recipeCard = document.createElement('div');
                        recipeCard.classList.add('recipeCard');

                        const recipeImg = document.createElement('img');
                        recipeImg.src = recipe.image_url;
                        recipeImg.alt = recipe.title;

                        const recipeTitle = document.createElement('h2');
                        recipeTitle.textContent = recipe.title;

                        const recipePublisher = document.createElement('p');
                        recipePublisher.textContent = `Publisher: ${recipe.publisher}`;

                        recipeCard.appendChild(recipeImg);
                        recipeCard.appendChild(recipeTitle);
                        recipeCard.appendChild(recipePublisher);

                        recipeCard.addEventListener('click', () => {
                            fetchRecipeDetails(recipe.id);
                        });

                        recipeList.appendChild(recipeCard);
                    });
                }
            })
            .catch(error => console.error(error));
    };

    const fetchRecipeDetails = (id) => {
        fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`)
            .then(response => response.json())
            .then(data => {
                const recipe = data.data.recipe;
                recipeDetails.innerHTML = `
                    <h2>${recipe.title}</h2>
                    <img src="${recipe.image_url}" alt="${recipe.title}" />
                    <p><strong>Publisher:</strong> ${recipe.publisher}</p>
                    <p><strong>Servings:</strong> ${recipe.servings}</p>
                    <p><strong>Cooking Time:</strong> ${recipe.cooking_time} minutes</p>
                    <p><strong>Ingredients:</strong></p>
                    <ul>
                        ${recipe.ingredients.map(ingredient => `<li>${ingredient.quantity} ${ingredient.unit} ${ingredient.description}</li>`).join('')}
                    </ul>
                `;
            })
            .catch(error => console.error(error));
    };

    recipeSearchBtn.addEventListener('click', () => {
        const query = recipeInput.value.trim();
        if (query) {
            fetchRecipes(query);
        }
        recipeInput.value = '';
    });
});