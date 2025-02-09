const fetch = require("node-fetch");

async function generateRecipeText(ingredients, dietaryRestrictions, gem2token, customPrompt) {
  const modelEndpoint = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it";

  // Build the prompt
  let prompt = customPrompt ? customPrompt.trim() : generateDefaultPrompt(ingredients, dietaryRestrictions);

  console.log("Prompt being sent to API:", prompt);

  // Simulated environment for testing
  if (process.env.NODE_ENV === 'test') {
    return simulateApiResponse(ingredients);
  }

  // Normal API call
  try {
    const response = await fetch(modelEndpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${gem2token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        max_new_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (data && data.error) {
      throw new Error(data.error);
    }

    const recipeText = data[0]?.generated_text?.trim();
    console.log("Generated recipe text:", recipeText);

    return parseRecipeText(recipeText);
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
}

function generateDefaultPrompt(ingredients, dietaryRestrictions) {
  let prompt = `Generate a healthy and tasty recipe in the following text format:
  Recipe Name: Recipe Name
  Description: A short description
  Calores: Calorie count
  Ingredients: ingredient 1, ingredient 2, ingredient 3
  Instructions: step 1, step 2, step 3
  Using some or all of the following ingredients: ${ingredients.join(", ")}.`;
  
  if (dietaryRestrictions && dietaryRestrictions.length > 0) {
    prompt += ` Consider these dietary restrictions: ${dietaryRestrictions.join(", ")}.`;
  }
  return prompt;
}

function simulateApiResponse(ingredients) {
  let simulatedText;
  if (ingredients.includes("invalid")) {
    // Simulate the default sample response (which should be filtered out later)
    simulatedText = `Recipe Name: Recipe Name
    Description: A short description
    Ingredients: ingredient 1, ingredient 2
    Instructions: step 1, step 2`;
  } else {
    // Simulate a valid recipe response
    simulatedText = `Recipe Name: Apple Banana Delight
    Description: A delightful recipe using apple and banana
    Ingredients: apple, banana, honey, cinnamon
    Instructions: Mix ingredients, Bake for 20 minutes`;
  }
  console.log("Simulated API response:", simulatedText);
  return simulatedText;
}

async function generateRecipes(ingredients, dietaryRestrictions) {
  const gem2token = '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';
  if (!gem2token) {
    throw new Error("GEM2 API key is missing. Set the GEM2_ACCESS_TOKEN environment variable.");
  }

  try {
    const recipeText = await generateRecipeText(ingredients, dietaryRestrictions, gem2token);
    return recipeText ? recipeText : null;
  } catch (error) {
    console.error("Error in generateRecipes:", error);
    return null;
  }
}

function parseRecipeText(recipeText) {
  try {
    // Clean up and parse the text response
    const cleanedText = recipeText.trim();
    console.log("Cleaned recipe text:", cleanedText);

    // Basic check for recipe structure
    if (!cleanedText.includes("Recipe Name") || !cleanedText.includes("Description")) {
      throw new Error("Invalid recipe structure.");
    }

    // Returning the recipe as text instead of object
    return cleanedText;
  } catch (error) {
    console.error("Error parsing recipe text:", error);
    return "Error: Unable to parse recipe text.";
  }
}

module.exports = { generateRecipes, generateRecipeText, parseRecipeText };
