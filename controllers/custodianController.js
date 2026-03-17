import pool from "../db.js";

/* ADD CUSTODIAN */
export const addCustodian = async (req, res) => {
  try {
    const {
      custodianId,
      custodianName,
      department,
      designation,
     reporting_authority,
      email,
      userName,
      phone,
      password
    } = req.body;

    const newCustodian = await pool.query(
      `INSERT INTO custodians
      (custodian_id,custodian_name,department,designation,reporting_authority,email,username,phone,password)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        custodianId,
        custodianName,
        department,
        designation,
        reporting_authority,
        email,
        userName,
        phone,
        password
      ]
    );

    res.json(newCustodian.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
};

/* GET ALL CUSTODIANS */
export const getCustodians = async (req, res) => {
  try {
    const allCustodians = await pool.query(
      "SELECT * FROM custodians ORDER BY id DESC"
    );

    res.json(allCustodians.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json("Server Error");
  }
};
/* UPDATE CUSTODIAN */
export const updateCustodian = async (req, res) => {
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
        authority,
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
export const deleteCustodian = async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(
      "DELETE FROM custodians WHERE id=$1",
      [id]
    );

    res.json("Custodian deleted successfully");

  } catch (error) {

    console.error(error.message);
    res.status(500).json("Server Error");

  }
};