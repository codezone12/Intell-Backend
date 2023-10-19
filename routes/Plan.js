import { Router } from "express";
import { addPlan } from "../controllers/Plan.js";
import { PLAN } from "../utils/apiRoutes.js";

const router = Router();
const { ADD } = PLAN;

router.post(ADD, addPlan);

export default router;
