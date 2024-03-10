import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { conversations_router } from "./routes/conversations.js";
import { messages_router } from "./routes/messages.js";

const app = express();
const server = createServer(app);

const cors_options = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
};

const io = new Server(server, {
  cors: cors_options,
});
const port = process.env.PORT || 8000;

// ! --------- MIDDLEWARE -------------
app.use(express.json());
app.use(cors(cors_options));
// ! --------- MIDDLEWARE END -------------

// ! --------- SOCKET IO -------------
io.on("connection", (socket) => {
  socket.on("joinRoom", (room) => {
    socket.join(room); // Join the specified room
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("message", (data) => {
    const message = data;
    // Emit the message to all sockets in the specified room
    io.to(message.conversation_id).emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

// ! --------- SOCKET IO END -------------

// ! Routes
app.use("/conversations", conversations_router);
app.use("/messages", messages_router);

// ! App Start
server.listen(port, () => {
  console.log("Chat App Backend running on port " + port);
});
