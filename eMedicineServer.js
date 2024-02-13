const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 80;

// Middleware to parse JSON requests
app.use(express.json());

// ÀÌ°Ô ¹ºÁö?
// Set default values for serviceKey and type
const SERVICE_KEY =
  "fjoCUuXC7HQR6qgJCyAJIOg5%2FYUNy6dSTytyLaCCxigO00I9GGlAgEKGO0Esps%2BgLwyc6%2FK%2FbIip3JEzj%2FjTkA%3D%3D";
const DEFAULT_TYPE = "json";

// Route handler for /getDrbEasyDrugList
app.get("/getDrbEasyDrugList", async (req, res) => {
  // Extract query parameters and set default values for serviceKey and type
  const { itemName, pageNo, numOfRows, entpName } = req.query;
  const serviceKey = SERVICE_KEY;
  const type = DEFAULT_TYPE; // Force default to JSON

  // Validate required parameter
  if (!itemName) {
    return res
      .status(400)
      .json({ error: "Missing required query parameter: itemName." });
  }

  try {
    // Construct the request URL for the external API
    const apiUrl = `https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList?serviceKey=${serviceKey}&itemName=${encodeURIComponent(
      itemName
    )}&type=${type}${pageNo ? `&pageNo=${pageNo}` : ""}${
      numOfRows ? `&numOfRows=${numOfRows}` : ""
    }${entpName ? `&entpName=${encodeURIComponent(entpName)}` : ""}`;

    // Make the request to the external API
    const response = await axios.get(apiUrl);

    // Since type is always JSON, directly send the JSON response
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching drug information:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
