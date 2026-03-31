import db from "../db.js";
const pool = db.assetAMS;

/* ADD CUSTODIAN */
 const addCustodian = async (req, res) => {
  try {
    const {
      custodianId,
      custodianName,
      department,
      designation,
     reportingAuthority,
      email,
      userName,
      phone,
      password
    } = req.body;

  const newCustodian = await pool.query(
  `INSERT INTO custodians
  (custodian_id,custodian_name,department,designation,reporting_authority,email,username,phone,password,status)
  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
  RETURNING *`,
  [
    custodianId,
    custodianName,
    department,
    designation,
    reportingAuthority,
    email,
    userName,
    phone,
    password,
    "active"   // ✅ NEW
  ]
);

    res.json(newCustodian.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
};


/* GET ALL CUSTODIANS */
 const getCustodians = async (req, res) => {
  try {
    const allCustodians = await pool.query(
     "SELECT * FROM custodians WHERE status = 'active' ORDER BY id DESC"
    );

    res.json(allCustodians.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
};
/* UPDATE CUSTODIAN */
 const updateCustodian = async (req, res) => {
  try {

    const { id } = req.params;

    const {
      custodianId,
      custodianName,
      department,
      designation,
     reportingAuthority,
      email,
      username
    } = req.body;

    const updateCustodian = await pool.query(
      `UPDATE custodians
       SET custodian_id=$1,
           custodian_name=$2,
           department=$3,
           designation=$4,
         
              reporting_authority=$5,
           email=$6,
           username=$7
       WHERE id=$8
       RETURNING *`,
      [
        custodianId,
        custodianName,
        department,
        designation,
        reportingAuthority,
        email,
        username,
        id
      ]
    );

    res.json(updateCustodian.rows[0]);

  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
};
const deleteCustodian = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE custodians
       SET status = 'inactive'
       WHERE id = $1`,
      [id]
    );

    res.json("Custodian deactivated successfully");

  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
};
export {
  addCustodian,
  getCustodians,
  updateCustodian,
  deleteCustodian
};