import React, { useState, useEffect } from "react";
import './App.css';

const API_KEY = process.env.REACT_APP_API_KEY; // Store the API key in one place

const ImageUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState("");
    const [ingredients, setIngredients] = useState([]);
    const [newIngredient, setNewIngredient] = useState("");
    const [showModal, setShowModal] = useState(false);

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

    // Function to toggle the modal visibility
    const toggleModal = () => {
        setShowModal(!showModal);
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
            const uploadResponse = await fetch("https://api.logmeal.com/v2/image/segmentation/complete", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${API_KEY}`,  // Use environment variable
                },
                body: formData,
            });
    
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
            const sortedIngredients = ingredientsData.foodName || [];
    
            // Sort ingredients alphabetically before saving them
            const sortedAndFilteredIngredients = [...new Set(sortedIngredients)]  // Remove duplicates
                .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())); // Sort alphabetically
    
            // Save ingredients to local storage
            localStorage.setItem("ingredientsData", JSON.stringify(sortedAndFilteredIngredients));
            setIngredients(sortedAndFilteredIngredients);
    
            console.log("Ingredients data saved to local storage");
    
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };
    

    const addIngredient = () => {
        if (newIngredient.trim() !== "") {
            const updatedIngredients = [...ingredients, newIngredient.trim()];
            setIngredients(updatedIngredients);
            //localStorage.setItem("ingredientsData", JSON.stringify(updatedIngredients));
            setNewIngredient("");
        }
    };

    const removeIngredient = (index) => {
        const updatedIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(updatedIngredients);
        //localStorage.setItem("ingredientsData", JSON.stringify(updatedIngredients)); // Update local storage
    };

    return (
        <div className='App' tyle={{ textAlign: "center", padding: "20px" }}>
             <div className="header-container">
                <h2>Upload an Image of Your Ingredients!</h2>
                <button className="help-btn" onClick={toggleModal}>?</button>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="close-btn" onClick={toggleModal}>✖</button>
                        <h3>Need Help?</h3>
                        <p>Upload an image of your ingredients, and we will identify them for you!</p>
                    </div>
                </div>
            )}
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
                    <div className="manual-input">
                        <input
                            type="text"
                            placeholder="Enter ingredient"
                            value={newIngredient}
                            onChange={(e) => setNewIngredient(e.target.value)}
                        />
                        <button onClick={addIngredient} className="add-btn">Add</button>
                    </div>
                    <button className="view-recipes-btn">View Recipes</button>
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
