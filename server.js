const express = require("express");
const cors = require("cors");
require("dotenv").config();

const assetRoutes = require("./routes/assetRoute");
const mailRoutes = require("./routes/mailRoute");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Correct Route Mounting
app.use("/api/assets", assetRoutes);
app.use("/api/mail", mailRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});