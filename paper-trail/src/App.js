import React, { useState, useEffect } from "react";
import './App.css';

const API_KEY = "ENTER KEY"; // Store the API key in one place

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

    // Handle file upload and Logmeal API interaction
    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            // Upload the image to Logmeal for segmentation
            const uploadResponse = await fetch(
                "https://api.logmeal.com/v2/image/segmentation/complete",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                    },
                    body: formData,
                }
            );

            if (!uploadResponse.ok) {
                console.error("Upload failed:", uploadResponse.statusText);
                return;
            }

            const uploadData = await uploadResponse.json();
            console.log("Image Segmentation Success:", uploadData);

            // Fetch ingredients information using the imageId from segmentation
            const ingredientsResponse = await fetch(
                "https://api.logmeal.com/v2/recipe/ingredients",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        imageId: uploadData.imageId,
                    }),
                }
            );

            if (!ingredientsResponse.ok) {
                console.error("Ingredients Fetch failed:", ingredientsResponse.statusText);
                return;
            }

            const ingredientsData = await ingredientsResponse.json();
            setIngredients(ingredientsData.foodName || []);

            // Save ingredients to local storage
            localStorage.setItem("ingredientsData", JSON.stringify(ingredientsData.foodName || []));
            console.log("Ingredients data saved to local storage");
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const removeIngredient = (index) => {
        const updatedIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(updatedIngredients);
        //localStorage.setItem("ingredientsData", JSON.stringify(updatedIngredients)); // Update local storage
    };

    return (
        <div className='App' tyle={{ textAlign: "center", padding: "20px" }}>
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
                <div className='list-box' style={{ marginTop: "20px", textAlign: "left", display: "inline-block" }}>
                    <h3>Ingredients Found:</h3>
                    <ul>
                        {ingredients.map((ingredient, index) => (
                            <li key={index} className="ingredient-item">{ingredient}
                                <button
                                    onClick={() => removeIngredient(index)}
                                    className="remove-btn">
                                    X
                                </button>
                            </li>
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
