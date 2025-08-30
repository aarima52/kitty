const socket = io();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

let player = {
  x: Math.random() * 500,
  y: Math.random() * 300,
  color: "pink"
};

let otherPlayer = null;
let roomCode = null;

document.getElementById("joinBtn").onclick = () => {
  roomCode = document.getElementById("roomCode").value;
  if (roomCode) {
    socket.emit("joinRoom", roomCode);
  }
};

socket.on("message", (msg) => {
  console.log(msg);
});

socket.on("playerMove", (data) => {
  otherPlayer = data;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") player.y -= 5;
  if (e.key === "ArrowDown") player.y += 5;
  if (e.key === "ArrowLeft") player.x -= 5;
  if (e.key === "ArrowRight") player.x += 5;

  if (roomCode) {
    socket.emit("playerMove", { roomCode, data: player });
  }
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw self
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
  ctx.fill();

  // Draw other player
  if (otherPlayer) {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(otherPlayer.x, otherPlayer.y, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

draw();
