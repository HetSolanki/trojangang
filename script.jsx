import express from "express";
import fetch from "node-fetch";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});
app.use(limiter);

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// Astra DB configuration (Replace with your values from the Astra DB Dashboard)
const astraDbToken = process.env.ASTRA_DB_TOKEN;
const astraDbUrl = process.env.ASTRA_DB_URL;
const astraDbKeyspace = process.env.ASTRA_DB_KEYSPACE;
const astraDbTable = process.env.ASTRA_DB_TABLE;

// Function to send data to Astra DB using REST API
const sendToAstraDB = async (data) => {
  const url = `${astraDbUrl}/v2/namespaces/${astraDbKeyspace}/tables/${astraDbTable}/rows`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${astraDbToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to insert data into Astra DB.");
    }

    return response.json();
  } catch (error) {
    console.error("Error sending data to Astra DB:", error.message);
    throw error;
  }
};

// Endpoint to handle the form submission and upload data to Astra DB
app.post("/submit", async (req, res) => {
  const { name, dateOfBirth, timeOfBirth, gender } = req.body;

  const data = {
    name,
    date_of_birth: dateOfBirth,
    time_of_birth: timeOfBirth,
    gender,
  };

  try {
    const result = await sendToAstraDB(data);
    res.json(result); // Return the result from Astra DB
  } catch (error) {
    res.status(500).json({ error: "Error inserting data into Astra DB." });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});