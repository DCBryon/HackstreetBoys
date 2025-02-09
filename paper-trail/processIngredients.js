const fs = require("fs");

const readAndSortIngredients = () => {
    if (!fs.existsSync("IngredientsData.json")) {
        return [];
    }

    let data;
    try {
        data = fs.readFileSync("IngredientsData.json", "utf-8");
    } catch (error) {
        console.error("Error reading IngredientsData.json:", error);
        return []; // Return empty array if reading fails
    }

    let jsonData = {};
    try {
        jsonData = JSON.parse(data);
    } catch (error) {
        console.error("Error parsing IngredientsData.json:", error);
        return []; // Return empty array if parsing fails
    }

    let ingredients = jsonData.foodName || [];

    // Check if ingredients is an array
    if (!Array.isArray(ingredients)) {
        console.error("Ingredients data is not an array. Returning empty array.");
        return [];
    }

    // Remove duplicates and sort alphabetically
    ingredients = [...new Set(ingredients)]  // Remove duplicates
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())); // Sort alphabetically

    return ingredients;
};

module.exports = {
    readAndSortIngredients
};
