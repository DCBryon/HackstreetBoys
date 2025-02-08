import React, { useState, useEffect } from "react";

const API_KEY = "37158ecad1496b88e0ccf230ee00a86ccd57bc2b"; // Store the API key in one place

const ImageUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState("");
    const [ingredients, setIngredients] = useState([]);

    // Load ingredients from local storage on component mount
    useEffect(() => {
        const storedData = localStorage.getItem("ingredientsData");
        if (storedData) {
            setIngredients(JSON.parse(storedData));
        }
    }, []);

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewURL(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }
    
        const formData = new FormData();
        formData.append("image", selectedFile);
    
        try {
            // Upload the image to Logmeal for segmentation
            const uploadResponse = await fetch("https://api.logmeal.com/v2/image/segmentation/complete", {
                method: "POST",
                headers: { Authorization: `Bearer ${API_KEY}` },
                body: formData,
            });
    
            if (!uploadResponse.ok) {
                console.error("Upload failed:", uploadResponse.statusText);
                return;
            }
    
            const uploadData = await uploadResponse.json();
            console.log("Image Segmentation Success:", uploadData);
    
            // Fetch ingredients information
            const ingredientsResponse = await fetch("https://api.logmeal.com/v2/recipe/ingredients", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ imageId: uploadData.imageId }),
            });
    
            if (!ingredientsResponse.ok) {
                console.error("Ingredients Fetch failed:", ingredientsResponse.statusText);
                return;
            }
    
            const ingredientsData = await ingredientsResponse.json();
            setIngredients(ingredientsData.foodName || []);
    
            // Send the ingredients data to the backend for storage
            await fetch("http://localhost:5000/save-ingredients", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ingredientsData),
            });
    
            console.log("Ingredients data sent to backend");
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    // Fetch ingredients list from backend
    useEffect(() => {
        fetch("http://localhost:5000/api/ingredients") // Request from backend
            .then((response) => response.json()) // Parse JSON
            .then((data) => setIngredients(data)) // Store in state (no sorting here)
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Upload an Image of Your Ingredients!</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewURL && (
                <img
                    src={previewURL}
                    alt="Preview"
                    style={{ marginTop: "20px", maxWidth: "100%", height: "auto" }}
                />
            )}
            <br />
            <button
                onClick={handleUpload}
                style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
            >
                Find Ingredients
            </button>
            {ingredients.length > 0 && (
                <div style={{ marginTop: "20px", textAlign: "left", display: "inline-block" }}>
                    <h3>Ingredients Found:</h3>
                    <ul>
                        {ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default function App() {
    return (
        <div>
            <ImageUploader />
        </div>
    );
}
