# FreshLens: A Fresh Persepective On Meal Planning

This platform allows users to upload images of food or take pictures directly, identify the food items present, and then generate healthy recipes using those ingredients.

## Access the Live Application

Visit the live FreshLens web app directly at:

https://freshlens.azurewebsites.net
## Instructions for Setup and Running

### Prerequisites

Before getting started, ensure you have the following installed:

*   **Node.js:** (Version 22.0.0 or higher recommended) - [https://nodejs.org/](https://nodejs.org/)
*   **npm (Node Package Manager) or yarn:** (Comes with Node.js)
*   **Git:** (If you want to clone the repository) - [https://git-scm.com/](https://git-scm.com/)
*   **Postman (Optional):** For testing API endpoints - [https://www.postman.com/](https://www.postman.com/)

### Installation (For Local Development)

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/DCBryon/HackstreetBoys.git
    cd HackstreetBoys
    ```

2.  **Install Dependencies:**

    ```bash
    npm install  # or yarn install
    ```

3.  **Environment Variables:**

    *   Create a `.env` file in the root directory of your project.
    *   Add the following environment variables to the `.env` file:

        ```
        GEM2_ACCESS_TOKEN=your_hugging_face_access_token
        # Add any other environment variables here, like API keys, database credentials, etc.
        ```

    *   **Important:** Do *not* commit your `.env` file to version control. It should be in `.gitignore`.

### Running the Application (For Local Development)

**Development Server:**

```bash
npm start  # or yarn start
