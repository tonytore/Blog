import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();

app.use(cors());
app.use(bodyParser.json());

const Events = [];

app.post("/events", (req, res) => {
  const events = req.body;
  Events.push(events);
  axios.post("http://posts-cluster-ip-srv:4000/events", events);
  // axios.post('http://localhost:4001/events', events);
  // axios.post('http://localhost:4002/events', events);
  // axios.post('http://localhost:4003/events', events);
  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(Events);
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
