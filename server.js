// Import required modules
import express from "express";
import fetch from "node-fetch";
import cors from "cors"; // Import cors middleware
import dotenv from "dotenv"; // Import dotenv

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors()); // Use cors middleware to enable CORS

// Access the API key from the .env file
const SERPAPI_KEY = process.env.SERPAPI_KEY;

// Define a route for fetching hotels
app.get("/hotels", async (req, res) => {
  try {
    const { q, currency = "INR", check_in_date, check_out_date } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Required parameter: q (search query)" });
    }

    const hotels = await fetchHotels(q, currency, check_in_date, check_out_date);
    console.log("Hotels Data:", hotels); // Log hotels data before sending response
    res.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ error: "Failed to fetch hotels" });
  }
});

// Function to fetch hotels from SerpAPI
async function fetchHotels(q, currency, checkInDate = "", checkOutDate = "") {
  try {
    let url = `https://serpapi.com/search?engine=google_hotels&q=${encodeURIComponent(q)}&api_key=${SERPAPI_KEY}`;

    if (checkInDate) {
      url += `&check_in_date=${checkInDate}`;
    }
    if (checkOutDate) {
      url += `&check_out_date=${checkOutDate}`;
    }

    console.log("Fetching URL:", url);
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch hotels from SerpAPI: ${errorData.error}`);
    }

    const data = await response.json();

    return data || []; // Return an empty array if no results found
  } catch (error) {
    console.error("Error fetching hotels:", error);
    throw error;
  }
}

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
