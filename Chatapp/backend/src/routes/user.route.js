import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import { sendFriendRequest, getRecommendedUsers, getOutgoingFriendReqs,
    getMyFriends, acceptFriendRequest, getFriendRequests } from "../controllers/user.controller";
const router = express.Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.post("/friend-request/:id/accept", acceptFriendRequest);
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);


export default router;