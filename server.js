const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "mysecretkey";

// 🔗 MongoDB connect
mongoose.connect("mongodb+srv://nihalchikku15_db_user:autleWH2vlrwKmbt@cluster0.uqrlzky.mongodb.net/")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// 📦 Schema
const MessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const Message = mongoose.model("Message", MessageSchema);

// 🔐 Admin user (temporary)
const adminUser = {
  username: "admin",
  password: bcrypt.hashSync("1234", 8)
};

// 🔑 LOGIN API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== adminUser.username) {
    return res.status(401).send("User not found");
  }

  const valid = bcrypt.compareSync(password, adminUser.password);

  if (!valid) {
    return res.status(401).send("Wrong password");
  }

  const token = jwt.sign({ user: username }, SECRET, {
    expiresIn: "1h"
  });

  res.json({ token });
});

// 🔒 Token verify
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).send("No token");

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
}

// 📩 Save message
app.post("/contact", async (req, res) => {
  const newMsg = new Message(req.body);
  await newMsg.save();
  res.send("Saved");
});

// 📥 Get messages (protected)
app.get("/messages", verifyToken, async (req, res) => {
  const messages = await Message.find();
  res.json(messages);
});

// ❌ Delete message (protected)
app.delete("/messages/:id", verifyToken, async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

app.listen(3000, () => console.log("Server running"));