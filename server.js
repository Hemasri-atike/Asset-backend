import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import custodianRoutes from "./routes/custodianRoute.js";
import assetRoutes from "./routes/assetRoute.js";
import mailRoutes from "./routes/mailRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/assets", assetRoutes);
app.use("/api/mail", mailRoutes);
app.use("/custodians", custodianRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
