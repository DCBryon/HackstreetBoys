import React, { useState } from "react";

const API_KEY = 'Enter Key';  // Store the API key in one place

const ImageUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewURL, setPreviewURL] = useState("");

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
            const uploadResponse = await fetch('https://api.logmeal.com/v2/image/segmentation/complete', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
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
            const ingredientsResponse = await fetch('https://api.logmeal.com/v2/recipe/ingredients', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageId: uploadData.imageId,
                }),
            });

            if (!ingredientsResponse.ok) {
                console.error("Ingredients Fetch failed:", ingredientsResponse.statusText);
                return;
            }

            const ingredientsData = await ingredientsResponse.json();
            console.log("Ingredients Info:", ingredientsData);

            // Debug: Log the response data
            console.log("Ingredients Data:", ingredientsData);

        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Upload an Image of Your Ingredients!</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {previewURL && <img src={previewURL} alt="Preview" style={{ marginTop: "20px", maxWidth: "100%", height: "auto" }} />}
            <br />
            <button onClick={handleUpload} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
                Upload
            </button>
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
