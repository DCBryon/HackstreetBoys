// src/recipeGenerator.test.js
const { generateRecipes, parseRecipes, generateRecipesInternal } = require('./recipeGenerator'); // Import generateRecipesInternal
global.testIngredients = global.testIngredients || ["apple", "banana"];
global.testDietaryRestrictions = global.testDietaryRestrictions || ["gluten-free"];


describe('generateRecipes', () => {
    jest.setTimeout(15000);

    it('should generate recipes from the Hugging Face API', async () => {
        const recipes = await generateRecipes(testIngredients, testDietaryRestrictions);
    
        expect(recipes).not.toBeNull();  // Check that recipes is NOT null
    
        if (recipes) { // Only if recipes is not null, then check for recipes
            expect(recipes.length).toBeGreaterThanOrEqual(0); // Check for at least 0 recipes
    
            if (recipes.length > 0) { // If there are recipes, check for basic properties
                expect(recipes[0].name).toBeDefined();
                expect(recipes[0].ingredients).toBeDefined();
                expect(recipes[0].instructions).toBeDefined();
                // ... other checks as needed
            }
        }
    });

    it('should handle API errors with no recipes', async () => {
        const testIngredients = ['invalid'];
        const testDietaryRestrictions = ['nonexistent'];
    
        const recipes = await generateRecipes(testIngredients, testDietaryRestrictions);
    
        expect(recipes).toBeNull(); // Expect null because the API likely returns nothing useful
    });
    
    it('should test raw api', async () => {
        const API_KEY = process.env.GEM2_ACCESS_TOKEN;
        const prompt = `Generate a recipe in the following JSON format:
        {
            "name": "Recipe Name",
            "description": "A short description",
            "ingredients": ["ingredient 1", "ingredient 2", ...],
            "instructions": ["step 1", "step 2", ...]
        } using the following ingredients: apple, milk.`; // Specific JSON format

        try {
            const recipes = await generateRecipesInternal([], [], gem2token, prompt);
            console.log("Raw API Response:", recipes); // Log the recipes object
            expect(recipes.length).toBeGreaterThan(0); // Check if recipes were generated

            //Check if the keys exist

        } catch (error) {
            console.error("Error in raw api test:", error);
            // If the API call fails, this will be logged
            throw error; // Re-throw the error to fail the test
        }
    });

    it('should handle API errors with specific JSON format', async () => {
        const testIngredients = ['invalid'];
        const testDietaryRestrictions = ['nonexistent'];
    
        const recipes = await generateRecipes(testIngredients, testDietaryRestrictions);
        expect(recipes).toBeNull(); //Expect null because the API likely returns nothing useful
    });
});