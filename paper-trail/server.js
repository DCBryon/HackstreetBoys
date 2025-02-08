const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { readAndSortIngredients } = require("./processIngredients");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API route: Get ingredients (sorted immediately)
app.get("/api/ingredients", (req, res) => {
    const ingredients = readAndSortIngredients();

    console.log("🔄 Sending sorted ingredients:", ingredients);
    res.json(ingredients);
});

// API route: Save ingredients
app.post("/save-ingredients", (req, res) => {
    const ingredientsData = req.body;

    if (!ingredientsData || !Array.isArray(ingredientsData.foodName)) {
        return res.status(400).json({ message: "Invalid ingredients data!" });
    }

    const currentData = readAndSortIngredients();
    currentData.push(...ingredientsData.foodName);

    // Sort the data after adding the new ingredients
    currentData.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    // Write the sorted data back to the file
    fs.writeFileSync("IngredientsData.json", JSON.stringify(currentData, null, 2));

    console.log("✅ Ingredients saved and sorted:", ingredientsData);
    res.status(201).json({ message: "Ingredients saved and sorted successfully!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
