import express from "express";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};

app.post("/post/:id/comments", async (req, res) => {
  const commentsId = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id: commentsId, content, status: "pending", postId: req.params.id });
  commentsByPostId[req.params.id] = comments;

  try {
    axios.post("http://localhost:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentsId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    });
  } catch (err) {
    console.error("Error sending event to Event Bus:", err.message);
    // You can decide how to handle the error, but for now, just log it.
    // The service will still proceed to send a response to the client.
  }

  res.status(201).send(comments);
});

app.get("/post/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { id, postId, status, content } = data;
    
    try {
      const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

      axios.post("http://localhost:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          status,
          postId,
          content,
        },
      });
    } catch (err) {
      console.error("Error sending event to Event Bus:", err.message);
      // You can decide how to handle the error, but for now, just log it.
      // The service will still proceed to send a response to the client.
    }
  }

  res.status(201).send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
