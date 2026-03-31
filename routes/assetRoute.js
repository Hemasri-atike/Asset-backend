import express from "express";
import db from "../db.js";
import { format } from "date-fns";
const formatDate = (date) => {
  if (!date) return null;
  return format(date, "yyyy-MM-dd"); 
};
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const result = await db.assetSAP.query(`
  SELECT
    "SLNO" AS "id",
    "AssetID" AS "assetId",
    "Latitude" AS "latitude",
"Longitude" AS "longitude",
"Location" AS "location",
"Status" AS "status",
"LocationDesc" AS "locationDesc",
"AssetDesc" AS "assetDesc",
    "MainAssetNumber" AS "assetNumber",
    "AssetSubNumber" AS "subAssetNumber",
    "AssetClass" AS "assetClass",
    "AssetDescription" AS "assetDescription",
    "Indentor" AS "intenderName",
    "AssetOwner" AS "custodianName",
    "SerialNumber" AS "serialNumber",
    "MACID" AS "macId",
    "LocationID" AS "locationId",
    "BLOCK" AS "block",
    "Model" AS "model",
    "GRNumber" AS "grNumber",
    "YearofPurchase" AS "yearOfPurchase",
    "CapitalizationDate" AS "capitalizationDate",
    "ExpiryDate" AS "expiryDate",
    "CostCenter" AS "costCenter",
    "MaterialNumber" AS "materialNumber",
    "AcceptDatebyUser" AS "acceptDate",
    "POID" AS "poNumber",
    "WBSNumberforReference" AS "wbsNumber",
    "InstallationDateforReference" AS "installationDate",
    "AssetSupplier" AS "assetVendor",
    "Department" AS "department",
    "Remarks" AS "remarks"
  FROM public."AssetMaster"
  ORDER BY "SLNO" DESC;
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

   const result = await db.assetSAP.query(
  `
  INSERT INTO public."AssetMaster" (
    "AssetID",
     "Latitude",           -- ✅ ADD
  "Longitude",
    "MainAssetNumber",
    "AssetSubNumber",
    "AssetClass",
    "AssetDescription",
    "Indentor",
    "AssetOwner",
    "SerialNumber",
    "MACID",
    "LocationID",
    "BLOCK",
    "Model",
    "GRNumber",
    "YearofPurchase",
    "CapitalizationDate",
    "ExpiryDate",
    "CostCenter",
    "MaterialNumber",
    "AcceptDatebyUser",
    "POID",
    "WBSNumberforReference",
    "InstallationDateforReference",
    "AssetSupplier",
    "Department",
    "Remarks"
  )
  VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
    $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
    $21,$22,$23,$24,$25,$26,$27
  )
  RETURNING *
  `,
  [
    assetId || null,
      req.body.latitude || null,         // 2 ✅
  req.body.longitude || null, 
    assetNumber || null,
    subAssetNumber || null,
    assetClass || null,
    assetDescription || null,
    intenderName || null,
    custodianName || null,
    serialNumber || null,
    macId || null,
    locationId || null,
    block || null,
    model || null,
    grNumber || null,
    yearOfPurchase || null,
    formatDate(capitalizationDate),
    formatDate(expiryDate),
    costCenter || null,
    materialNumber || null,
    formatDate(acceptDate),
    poNumber || null,
    wbsNumber || null,
    formatDate(installationDate),
    assetVendor || null,
    department || null,
    remarks || null
  ]
);

    res.status(201).json(result.rows[0]);
     console.log("Incoming Data:", req.body);
  } catch (error) {
    console.error("Insert Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.assetSAP.query(
      `
      SELECT
        "SLNO" AS "id",
        "AssetID" AS "assetId",
        "Latitude" AS "latitude",
        "Longitude" AS "longitude",
        "Location" AS "location",
        "Status" AS "status",
        "LocationDesc" AS "locationDesc",
        "AssetDesc" AS "assetDesc",
        "MainAssetNumber" AS "assetNumber",
        "AssetSubNumber" AS "subAssetNumber",
        "AssetClass" AS "assetClass",
        "AssetDescription" AS "assetDescription",
        "Indentor" AS "intenderName",
        "AssetOwner" AS "custodianName",
        "SerialNumber" AS "serialNumber",
        "MACID" AS "macId",
        "LocationID" AS "locationId",
        "BLOCK" AS "block",
        "Model" AS "model",
        "GRNumber" AS "grNumber",
        "YearofPurchase" AS "yearOfPurchase",
        "CapitalizationDate" AS "capitalizationDate",
        "ExpiryDate" AS "expiryDate",
        "CostCenter" AS "costCenter",
        "MaterialNumber" AS "materialNumber",
        "AcceptDatebyUser" AS "acceptDate",
        "POID" AS "poNumber",
        "WBSNumberforReference" AS "wbsNumber",
        "InstallationDateforReference" AS "installationDate",
        "AssetSupplier" AS "assetVendor",
        "Department" AS "department",
        "Remarks" AS "remarks"
      FROM public."AssetMaster"
      WHERE "SLNO" = $1
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
  await db.assetSAP.query(
  'DELETE FROM public."AssetMaster" WHERE "SLNO" = $1',
  [id]
);
  res.json({ message: "Deleted successfully" });
});
router.put("/:id", async (req, res) => {
  const { id } = req.params;

const {
  assetId,
  latitude,
  longitude,
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
   const result = await db.assetSAP.query(
  `
  UPDATE public."AssetMaster" SET
    "AssetID" = $1,
    "Latitude" = $2,
    "Longitude" = $3,
    "MainAssetNumber" = $4,
    "AssetSubNumber" = $5,
    "AssetClass" = $6,
    "Indentor" = $7,
    "AssetDescription" = $8,
    "AssetOwner" = $9,
    "SerialNumber" = $10,
    "MACID" = $11,
    "LocationID" = $12,
    "BLOCK" = $13,
    "Model" = $14,
    "GRNumber" = $15,
    "YearofPurchase" = $16,
    "CapitalizationDate" = $17,
    "ExpiryDate" = $18,
    "CostCenter" = $19,
    "MaterialNumber" = $20,
    "AcceptDatebyUser" = $21,
    "POID" = $22,
    "WBSNumberforReference" = $23,
    "InstallationDateforReference" = $24,
    "AssetSupplier" = $25,
    "Department" = $26,
    "Remarks" = $27
  WHERE "SLNO" = $28
  RETURNING *
  `,
  [
    assetId || null,
    latitude || null,
    longitude || null,
    assetNumber || null,
    subAssetNumber || null,
    assetClass || null,
    intenderName || null,
    assetDescription || null,
    custodianName || null,
    serialNumber || null,
    macId || null,
    locationId || null,
    block || null,
    model || null,
    grNumber || null,
    yearOfPurchase || null,
    formatDate(capitalizationDate),
    formatDate(expiryDate),
    costCenter || null,
    materialNumber || null,
    formatDate(acceptDate),
    poNumber || null,
    wbsNumber || null,
    formatDate(installationDate),
    assetVendor || null,
    department || null,
    remarks || null,
    id
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