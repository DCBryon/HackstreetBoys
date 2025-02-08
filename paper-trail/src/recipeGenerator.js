// recipeGenerator.js (This would run on your backend server)
const fetch = require('node-fetch');

// Use environment variables or a secrets management service.
const phi4Token = process.env.PHI4_ACCESS_TOKEN;  // Accessing environment variable

if (!phi4Token) {
    throw new Error("PHI-4 API key is missing. Set the PHI4_ACCESS_TOKEN environment variable.");
}

async function generateRecipes(ingredients, dietaryRestrictions) {
    const modelEndpoint = "https://api-inference.huggingface.co/models/microsoft/phi-4"; // PHI-4 Endpoint
    try {
        let prompt = `Generate 3 healthy and delicious recipes using the following ingredients: ${ingredients.join(", ")}.`;

        if (dietaryRestrictions) {
            prompt += `  Consider these dietary restrictions: ${dietaryRestrictions.join(", ")}.`;
        }

        prompt += " Provide the recipe name, a brief description, the ingredients list, and the instructions."; // Clearer instructions for ChatGPT
        const response = await fetch(modelEndpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${phi4Token}`, // Correct way to use the token
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: prompt, // phi-4 expects the prompt directly as 'inputs'
            }),
        });

        if (!response.ok) {
            const errorData = await response.json(); // Get error details if available
            throw new Error(`Hugging Face API error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        // **Crucially**, inspect the actual response from the Hugging Face API.
        // The structure can vary.  Commonly, it's an array, and the generated text
        // is in data[0].generated_text.  But it could be different!
        let recipesText = "";
        if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
          recipesText = data[0].generated_text;
        } else if (data.generated_text) { // Handle cases where it is not an array.
          recipesText = data.generated_text;
        } else {
          console.error("Unexpected response format from Hugging Face API:", data);
          throw new Error("Unexpected response format from Hugging Face API.");
        }

        // **Parse the recipesText (Crucial):** ChatGPT's output is text.  You *must* parse it to get structured data.
        // This is a basic example; you'll likely need to refine it based on ChatGPT's output format.
        const recipes = parseRecipes(recipesText); // See function below

        return recipes;

    } catch (error) {
        console.error("Error generating recipes:", error);
        throw error; // Re-throw the error for the client to handle
    }
}

// **Crucial: Parsing Function**
function parseRecipes(recipesText) {
  // This is a *very basic* example and will need refinement!
  // ChatGPT's output format can vary, so adjust accordingly.  Use regex or string manipulation.
  const recipes = [];
  const recipeBlocks = recipesText.split("\n\n"); // Assuming recipes are separated by double newlines

  for (const block of recipeBlocks) {
    if (block.trim() !== "") { // Skip empty blocks
      const lines = block.split("\n");
      let recipe = {};
      recipe.name = lines[0].replace("Recipe Name:","").trim(); // Extract name
      recipe.description = lines[1].replace("Description:","").trim(); // Extract description
      recipe.ingredients = [];
      recipe.instructions = [];

      let inIngredients = false;
      let inInstructions = false;
      for(let i = 2; i < lines.length; i++){
          if(lines[i].includes("Ingredients:")){
              inIngredients = true;
          } else if (lines[i].includes("Instructions:")){
              inInstructions = true;
              inIngredients = false;
          } else if (inIngredients){
              recipe.ingredients.push(lines[i].trim());
          } else if (inInstructions){
              recipe.instructions.push(lines[i].trim());
          }
      }
      recipes.push(recipe);
    }
  }

  return recipes;
}


module.exports = { generateRecipes, parseRecipes }; // Export the functions