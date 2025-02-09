import '@testing-library/jest-dom'; // Import the jest-dom matchers
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
console.log("GEM2_ACCESS_TOKEN (setupTests):", process.env.GEM2_ACCESS_TOKEN); // Debugging line