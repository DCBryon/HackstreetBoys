import React, { useState } from 'react';

function RecipeApp() {
    const [ingredients, setIngredients] = useState('');
    const [dietaryRestrictions, setDietaryRestrictions] = useState('');
    const [recipes, setRecipes] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/generate', { // Your backend endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ingredients: ingredients.split(",").map(item => item.trim()), // Split ingredients by comma
                    dietaryRestrictions: dietaryRestrictions.split(",").map(item => item.trim()), // Split dietary restrictions by comma
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setRecipes(data.recipes);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            // Handle error (e.g., display an error message to the user)
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Ingredients (comma-separated):</label><br />
                <input type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} /><br />

                <label>Dietary Restrictions (comma-separated):</label><br />
                <input type="text" value={dietaryRestrictions} onChange={(e) => setDietaryRestrictions(e.target.value)} /><br />

                <button type="submit">Generate Recipes</button>
            </form>

            {/* Display Recipes */}
            {recipes.length > 0 && (
                <div>
                    <h2>Recipes:</h2>
                    {recipes.map((recipe, index) => (
                        <div key={index}>
                            <h3>{recipe.name}</h3>
                            <p>{recipe.description}</p>
                            <h4>Ingredients:</h4>
                            <ul>
                                {recipe.ingredients.map((ingredient, i) => (
                                    <li key={i}>{ingredient}</li>
                                ))}
                            </ul>
                            <h4>Instructions:</h4>
                            <ol>
                                {recipe.instructions.map((instruction, i) => (
                                    <li key={i}>{instruction}</li>
                                ))}
                            </ol>
                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RecipeApp;