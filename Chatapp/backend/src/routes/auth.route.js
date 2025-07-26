import express from "express"
import { signup, login, logout, onboard } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", (req, res)=> signup(req, res));
router.post("/login", (req, res)=>login(req, res));
router.post("/logout", (req, res)=> logout(req, res));
router.post("/onboarding", protectRoute, onboard);

router.get("/me", protectRoute, (req, res)=>{
    res.status(200).json({success:true, user:req.user});
});

export default router;