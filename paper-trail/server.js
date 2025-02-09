// server.js (Your backend server)
require('dotenv').config() // for env variables

const express = require('express');
const app = express();
const { generateRecipes } = require('./src/recipeGenerator'); // Import the function

app.use(express.json()); // To parse JSON request bodies

app.post('/generate', async (req, res) => {
    const { ingredients, dietaryRestrictions } = req.body;

    try {
        const recipes = await generateRecipes(ingredients, dietaryRestrictions);
        res.json({ recipes }); // Send the recipes back to the client
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Failed to generate recipes" }); // Send an error response
    }
});

const port = process.env.PORT || 5000; // Define a port
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});