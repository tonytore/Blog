import express from "express";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {});

app.post("/posts", async (req, res) => {
  const { type, data } = req.body;
  if (type === "CommentCreated") {
    const status = content.includes("orange") ? "rejected" : "approved";

    await axios.post("http://localhost:4005/events", {
      type: "CommentModerated",
      data: {
        id,
        content: data.content,
        postId: data.postId,
        status,
      },
    });
  }

  res.send({
    status: "OK",});
});

app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);
  res.status(201).send({});
});

app.listen(4003, () => {
  console.log("Listening on 4003");
});
