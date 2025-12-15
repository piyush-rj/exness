import { Router } from "express";
import signInController from "../controllers/user-controller/signInController";

const router = Router();

// user-controllers
router.post('/sign-in', signInController);

// trade-controllers


export default router;