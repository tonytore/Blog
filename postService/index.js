import express from "express";
import cors from "cors";
import axios from "axios";
import bodyParser from "body-parser";
import { randomBytes } from "crypto";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});
app.post("/posts", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;

  posts[id] = {
    id,
    title,
  };
  axios.post("http://event-bus-srv:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send("post successfully created");
});

app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);
  res.status(201).send({});
});

app.listen(4000, () => {
  console.log("v27");

  console.log("Listening on 4000");
});
