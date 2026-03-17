import express from "express";
import { addCustodian, getCustodians,updateCustodian ,deleteCustodian} from "../controllers/custodianController.js";

const router = express.Router();

/* POST - Add Custodian */
router.post("/", addCustodian);

/* GET - Get All Custodians */
router.get("/", getCustodians);
router.put("/:id", updateCustodian);
router.delete("/:id", deleteCustodian);


export default router;