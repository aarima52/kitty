const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ✅ Serve static files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Always serve index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Basic 2-player room system ---
io.on("connection", (socket) => {
  console.log("🐾 User connected:", socket.id);

  socket.on("joinRoom", (roomCode) => {
    socket.join(roomCode);
    console.log(`User ${socket.id} joined room ${roomCode}`);
    io.to(roomCode).emit("message", `A new kitty joined room ${roomCode}!`);
  });

  socket.on("playerMove", ({ roomCode, data }) => {
    socket.to(roomCode).emit("playerMove", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Use Render PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Kitty.io running on port ${PORT}`);
});
