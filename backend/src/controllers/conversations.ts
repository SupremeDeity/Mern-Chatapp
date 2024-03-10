import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";

export async function getConversations(req: Request, res: Response) {
  try {
    const collection = db.collection("conversations");
    const result = await collection
      .find({
        participants: { $in: [req.params.participant] },
      })
      .toArray();
    res.status(200).json(result);
  } catch (e) {
    console.log("Error fetching conversations record: " + e);
    res.status(500).json("Error fetching conversations record: " + e);
  }
}

export async function createConversation(req: Request, res: Response) {
  try {
    const collection = db.collection("conversations");
    const count = await collection.countDocuments({
      participants: { $in: [req.body.participant] },
    });
    console.log(count);
    if (count >= 5) {
      throw new Error("Conversation limit reached.");
    }

    const result = await collection.insertOne({
      participants: [req.body.participant],
    });

    res.status(200).json(result);
  } catch (e) {
    console.log("Error creating conversations record: " + e);
    res.status(500).json("Error creating conversations record: " + e);
  }
}

export async function joinConversation(req: Request, res: Response) {
  try {
    const collection = db.collection("conversations");
    const conversation = await collection.findOne({
      _id: new ObjectId(req.body.conversation_id),
    });
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    if (!conversation.participants.includes(req.body.participant)) {
      const count = await collection.countDocuments({
        participants: { $in: [req.body.participant] },
      });

      if (count >= 5) {
        throw new Error("Conversation limit reached.");
      }
      await collection.updateOne(
        { _id: new ObjectId(req.body.conversation_id) },
        { $push: { participants: req.body.participant } }
      );
    }
    res.status(200).json(conversation);
  } catch (e) {
    console.log("Error joining conversation: " + e);
    res.status(500).json("Error joining conversation: " + e);
  }
}

export async function checkIsParticipant(req: Request, res: Response) {
  try {
    const collection = db.collection("conversations");
    const conversation = await collection.findOne({
      _id: new ObjectId(req.params.conversation_id),
    });

    if (!conversation) {
      throw new Error("Conversation does not exist");
    }
    if (!conversation.participants.includes(req.params.participant)) {
      throw new Error("Not a participant. Join Conversation first.");
    }

    res.status(200).json(conversation);
  } catch (e) {
    console.log("Error joining conversation: " + e);
    res.status(500).json("Error joining conversation: " + e);
  }
}
