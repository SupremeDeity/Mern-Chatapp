import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";

export async function deleteMessage(req: Request, res: Response) {
  try {
    const collection = db.collection("messages");
    const result = await collection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.status(200).json(result);
  } catch (e) {
    console.log("Error deleting record: " + e);
    res.status(500).json("Error deleting record: " + e);
  }
}

export async function sendMessage(req: Request, res: Response) {
  try {
    const collection = db.collection("messages");
    const newMessage = {
      conversation_id: req.body.conversation_id,
      author: req.body.author,
      author_img: req.body.author_img,
      content: req.body.content,
      createdAt: new Date(),
    };

    const m = await collection.insertOne(newMessage);
    res.status(200).json(m);
  } catch (e) {
    console.log("Error adding record: " + e);
    res.status(500).json("Error adding record: " + e);
  }
}

export async function getMessages(req: Request, res: Response) {
  try {
    const messages = await db
      .collection("messages")
      .find({
        conversation_id: req.params.conversation_id,
      })
      .toArray();
    res.json(messages);
  } catch (e) {
    console.log("Error getting record: " + e);
    res.status(500).json("Error getting record: " + e);
  }
}
