import { Router } from "express";
import UserRouter from "./User.js"
import PlanRouter from "./Plan.js"


const router = Router()

router.use("/", UserRouter)
router.use("/plan", PlanRouter)

export default router