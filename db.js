import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();

const { Pool } = pkg;

// 🔹 Common config
const commonConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

// 🔹 Create pools for each DB
const assetAMS = new Pool({
  ...commonConfig,
  database: process.env.DB_ASSETAMS,
});

const assetSAP = new Pool({
  ...commonConfig,
  database: process.env.DB_ASSETSAP,
});

const assetCommon = new Pool({
  ...commonConfig,
  database: process.env.DB_ASSETCOMMON,
});

// 🔹 Function to test connections
const testConnection = async (pool, name) => {
  try {
    await pool.query("SELECT 1");
    console.log(`✅ Connected to ${name}`);
  } catch (err) {
    console.error(`❌ Connection failed (${name}):`, err.message);
  }
};

// 🔹 Test all DBs
testConnection(assetAMS, "ASSETAMS");
testConnection(assetSAP, "ASSETSAP");
testConnection(assetCommon, "ASSETCOMMON");

// 🔹 Export all DBs in one place
export default {
  assetAMS,
  assetSAP,
  assetCommon,
};