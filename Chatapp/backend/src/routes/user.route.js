import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { sendFriendRequest, getRecommendedUsers, getMyFriends } from "../controllers/user.controller";
const router = express.Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("friend-request/:id", sendFriendRequest);

export default router;