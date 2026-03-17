import express from "express";
import pool from "../db.js ";
import { format } from "date-fns";
const formatDate = (date) => {
  if (!date) return null;
  return format(date, "yyyy-MM-dd"); 
};
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id AS "id",
        asset_id AS "assetId",
        asset_number AS "assetNumber",
        sub_asset_number AS "subAssetNumber",
        asset_class AS "assetClass",
        asset_description AS "assetDescription",
        intender_name AS "intenderName",
        custodian_name AS "custodianName",
        serial_number AS "serialNumber",
        mac_id AS "macId",
        location_id AS "locationId",
        block AS "block",
        model AS "model",
        gr_number AS "grNumber",
        year_of_purchase AS "yearOfPurchase",
        capitalization_date AS "capitalizationDate",
        expiry_date AS "expiryDate",
        cost_center AS "costCenter",
        material_number AS "materialNumber",
        accept_date AS "acceptDate",
        po_number AS "poNumber",
        wbs_number AS "wbsNumber",
        installation_date AS "installationDate",
        asset_vendor AS "assetVendor",
        department AS "department",
        remarks AS "remarks",
        created_at AS "createdAt"
      FROM public.assets
      ORDER BY id DESC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching assets:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
  const {
  assetId,
  assetNumber,
  subAssetNumber,
  assetClass,
  assetDescription,
  intenderName,
  custodianName,
  serialNumber,
  macId,
  locationId,
  block,
  model,
  grNumber,
  yearOfPurchase,
  capitalizationDate,
  expiryDate,
  costCenter,
  materialNumber,
  acceptDate,
  poNumber,
  wbsNumber,
  installationDate,
  assetVendor,
  department,
  remarks,
} = req.body;

    const result = await pool.query(
      `
      INSERT INTO public.assets (
        asset_id,
        asset_number,
        sub_asset_number,
        asset_class,
        intender_name,
        asset_description,
        custodian_name,
        serial_number,
        mac_id,
        location_id,
        block,
        model,
        gr_number,
        year_of_purchase,
        capitalization_date,
        expiry_date,
        cost_center,
        material_number,
        accept_date,
        po_number,
        wbs_number,
        installation_date,
        asset_vendor,
        department,
        remarks
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25
      )
      RETURNING *
      `,
      [
  assetId || null,              // 1
  assetNumber || null,          // 2
  subAssetNumber || null,       // 3
  assetClass || null,           // 4
  intenderName || null,         // 5
  assetDescription || null,     // 6
  custodianName || null,        // 7
  serialNumber || null,         // 8
  macId || null,                // 9
  locationId || null,           // 10
  block || null,                // 11
  model || null,                // 12
  grNumber || null,             // 13
  yearOfPurchase || null,       // 14
  formatDate(capitalizationDate), // 15
  formatDate(expiryDate),         // 16
  costCenter || null,             // 17  ✅ correct
  materialNumber || null,         // 18  ✅ correct
  formatDate(acceptDate),         // 19  ✅ correct
  poNumber || null,               // 20
  wbsNumber || null,              // 21
  formatDate(installationDate),   // 22  ✅ correct
  assetVendor || null,            // 23
  department || null,             // 24
  remarks || null                 // 25
]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Insert Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        id AS "id",
        asset_id AS "assetId",
        asset_number AS "assetNumber",
        sub_asset_number AS "subAssetNumber",
        asset_class AS "assetClass",
        asset_description AS "assetDescription",
        intender_name AS "intenderName",
        custodian_name AS "custodianName",
        serial_number AS "serialNumber",
        mac_id AS "macId",
        location_id AS "locationId",
        block AS "block",
        model AS "model",
        gr_number AS "grNumber",
        year_of_purchase AS "yearOfPurchase",
        capitalization_date AS "capitalizationDate",
        expiry_date AS "expiryDate",
        cost_center AS "costCenter",
        material_number AS "materialNumber",
        accept_date AS "acceptDate",
        po_number AS "poNumber",
        wbs_number AS "wbsNumber",
        installation_date AS "installationDate",
        asset_vendor AS "assetVendor",
        department AS "department",
        remarks AS "remarks",
        created_at AS "createdAt"
      FROM public.assets
      WHERE id = $1
      `,
      [id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM assets WHERE id = $1", [id]);
  res.json({ message: "Deleted successfully" });
});
router.put("/:id", async (req, res) => {
  const { id } = req.params;

const {
  assetId,
  assetNumber,
  subAssetNumber,
  assetClass,
  assetDescription,
  intenderName,
  custodianName,
  serialNumber,
  macId,
  locationId,
  block,
  model,
  grNumber,
  yearOfPurchase,
  capitalizationDate,
  expiryDate,
  costCenter,
  materialNumber,
  acceptDate,
  poNumber,
  wbsNumber,
  installationDate,
  assetVendor,
  department,
  remarks,
} = req.body;


  try {
    const result = await pool.query(
      `
      UPDATE public.assets SET
        asset_id = $1,
        asset_number = $2,
        sub_asset_number = $3,
        asset_class = $4,
        intender_name = $5,
        asset_description = $6,
        custodian_name = $7,
        serial_number = $8,
        mac_id = $9,
        location_id = $10,
        block = $11,
        model = $12,
        gr_number = $13,
        year_of_purchase = $14,
        capitalization_date = $15,
        expiry_date = $16,
        cost_center = $17,
        material_number = $18,
        accept_date = $19,
        po_number = $20,
        wbs_number = $21,
        installation_date = $22,
        asset_vendor = $23,
        department = $24,
        remarks = $25
      WHERE id = $26
      RETURNING *
      `,
   [
  assetId || null,              // 1
  assetNumber || null,          // 2
  subAssetNumber || null,       // 3
  assetClass || null,           // 4
  intenderName || null,         // 5
  assetDescription || null,     // 6
  custodianName || null,        // 7
  serialNumber || null,         // 8
  macId || null,                // 9
  locationId || null,           // 10
  block || null,                // 11
  model || null,                // 12
  grNumber || null,             // 13
  yearOfPurchase || null,       // 14
  formatDate(capitalizationDate), // 15
  formatDate(expiryDate),         // 16
  costCenter || null,             // 17  ✅
  materialNumber || null,         // 18  ✅
  formatDate(acceptDate),         // 19  ✅
  poNumber || null,               // 20
  wbsNumber || null,              // 21
  formatDate(installationDate),   // 22  ✅
  assetVendor || null,            // 23
  department || null,             // 24
  remarks || null,                // 25
  id                              // 26
]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.json({
      message: "Updated successfully",
      asset: result.rows[0],
    });

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;