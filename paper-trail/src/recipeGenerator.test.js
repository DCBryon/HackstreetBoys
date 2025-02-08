const { generateRecipes, parseRecipes } = require('./recipeGenerator'); // Import both functions

describe('generateRecipes', () => {

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([ // Example successful API response
                    { generated_text: "Recipe Name: Test Recipe\nDescription: A test recipe.\nIngredients:\n- Ingredient 1\nInstructions:\n- Step 1" }
                ]),
            })
        );
    });

    afterEach(() => {
        global.fetch.mockClear();
    });

    it('should generate recipes from the Hugging Face API', async () => {
        const ingredients = ['ingredient1', 'ingredient2'];
        const dietaryRestrictions = ['vegetarian'];

        const recipes = await generateRecipes(ingredients, dietaryRestrictions);

        expect(global.fetch).toHaveBeenCalledTimes(1); // Check if fetch was called
        // Check if the correct prompt was sent (you can use toHaveBeenCalledWith)
        expect(recipes).toHaveLength(1); // Check if recipes were returned
        expect(recipes[0].name).toBe('Test Recipe'); // Check properties of first recipe
    });

    it('should handle API errors', async () => {
        global.fetch.mockRejectedValue(new Error('API error')); // Mock an API error

        await expect(generateRecipes(['ing'], [])).rejects.toThrow('API error');
    });
});

describe('parseRecipes', () => {
    it('should correctly parse the recipe text', () => {
        const recipesText = "Recipe Name: Test Recipe\nDescription: A test recipe.\nIngredients:\n- Ingredient 1\nInstructions:\n- Step 1";
        const recipes = parseRecipes(recipesText);
        expect(recipes).toHaveLength(1);
        expect(recipes[0].name).toBe('Test Recipe');
    });

    // Add more tests for different recipe text formats
});