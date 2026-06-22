import express from "express";
import { chatBotReply } from "../controllers/chatController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

router.post("/", authUser, chatBotReply);

export default router;
