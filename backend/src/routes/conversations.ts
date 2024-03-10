import { Router } from "express";
import {
  checkIsParticipant,
  createConversation,
  getConversations,
  joinConversation,
} from "../controllers/conversations.js";

export const conversations_router = Router();

conversations_router.route("/").post(createConversation);
conversations_router.route("/join").post(joinConversation);
conversations_router
  .route("/verify/:conversation_id/:participant")
  .get(checkIsParticipant);
conversations_router.route("/:participant").get(getConversations);
