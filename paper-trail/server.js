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

// Save ingredients route (server.js)
app.post("/save-ingredients", (req, res) => {
    const ingredientsData = req.body;

    if (!ingredientsData || !Array.isArray(ingredientsData.foodName)) {
        return res.status(400).json({ message: "Invalid ingredients data!" });
    }

    const currentData = readAndSortIngredients();

    // Merge new ingredients with existing ones
    let updatedData = [...currentData, ...ingredientsData.foodName];

    // Remove duplicates and sort alphabetically
    updatedData = [...new Set(updatedData)]  // Remove duplicates
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())); // Sort alphabetically

    // Write the sorted and filtered data back to the file
    try {
        fs.writeFileSync("IngredientsData.json", JSON.stringify(updatedData, null, 2));
        console.log("✅ Ingredients saved and sorted:", updatedData);
        res.status(201).json({ message: "Ingredients saved and sorted successfully!" });
    } catch (error) {
        console.error("Error saving ingredients:", error);
        res.status(500).json({ message: "Error saving ingredients!" });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
