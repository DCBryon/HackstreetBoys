// processIngredients.js

const fs = require("fs");

// Read and process ingredients data
const readAndSortIngredients = () => {
    if (!fs.existsSync("IngredientsData.json")) {
        return [];
    }

    const data = fs.readFileSync("IngredientsData.json", "utf-8");

    let jsonData = {};
    try {
        jsonData = JSON.parse(data);
    } catch (error) {
        console.error("Error parsing IngredientsData.json:", error);
        return []; // Return empty array if parsing fails
    }

    // Extract foodName array (ingredients) from the JSON data
    let ingredients = jsonData.foodName || [];

    // Check if ingredients is an array
    if (!Array.isArray(ingredients)) {
        console.error("Ingredients data is not an array. Returning empty array.");
        return [];
    }

    // Sort ingredients alphabetically by name (case-insensitive)
    ingredients.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    return ingredients;
};

module.exports = {
    readAndSortIngredients
};
