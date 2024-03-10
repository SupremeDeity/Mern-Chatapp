import { Router } from "express";
import {
  deleteMessage,
  getMessages,
  sendMessage,
} from "../controllers/messages.js";

export const messages_router = Router();

messages_router.route("/").post(sendMessage);
messages_router.route("/:id").delete(deleteMessage);
messages_router.route("/:conversation_id").get(getMessages);
