const express = require("express");
const qrcode = require("qrcode");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const { Client, LocalAuth } = require("whatsapp-web.js");
const WAClient = require("./models/WAClient");
const { HomeController } = require("./controllers/HomeController");

const port = 3000;
const app = express();
const http = require("http");
const server = http.createServer(app);
require("dotenv").config();
const tokenKey = process.env.TOKEN_KEY;
const io = new Server(server, {
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
  allowEIO3: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let WA_Client;

app.use(express.static(path.join(__dirname, "public")));

// Use the saved values
WA_Client = new WAClient(
  new Client({
    authStrategy: new LocalAuth(),
  })
);

// Save session values to the file upon successful auth

io.on("connection", function (socket) {
  WA_Client.client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit("qr", url);
      socket.emit("message", "QR Code received, scan please!");
    });
  });

  WA_Client.client.on("ready", () => {
    socket.emit("ready", "Whatsapp is ready!");
    socket.emit("message", "Whatsapp is ready!");
  });

  WA_Client.client.on("authenticated", () => {
    WA_Client.isAuthenticated = true;
    socket.emit("authenticated", "Whatsapp is authenticated!");
    socket.emit("message", "Whatsapp is authenticated!");
    console.log("AUTHENTICATED");
  });
});

//route
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});
app.get("/checkWAAuth", (req, res) => {
  res.json({
    status: WA_Client.isAuthenticated,
  });
});
app.get("/send-wa-message", async (req, res) => {
  const { wa_number, message, token_key } = req.body;
  if (token_key != tokenKey) return res.send({ error: "unauthorized" });
  let resp;
  let sanitized_number = wa_number.toString().replace(/[^a-zA-Z0-9 ]/g, "");
  let final_number = `${sanitized_number}`;
  let number_details = await WA_Client.client.getNumberId(final_number); // get mobile number details

  if (number_details) {
    const sendMessageData = await WA_Client.client.sendMessage(
      number_details._serialized,
      message
    ); // send message
    console.log(sendMessageData);
  } else {
    resp = {
      status: "error",
      message: "Nomor Whatsapp tidak valid!",
    };
  }
  if (!WA_Client.isAuthenticated) {
    resp = {
      status: "error",
      message: "Koneksi Whatsapp Gagal",
    };
  }

  res.json(resp);
});

WA_Client.client.initialize();
server.listen(port, function () {
  console.log("App running on *: " + port);
});
