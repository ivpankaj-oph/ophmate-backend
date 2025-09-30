import { Router } from "express";
import userRouter from "./User.js";


const router = Router();


router.use("/user",userRouter);

export default router;
