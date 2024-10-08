import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoutes from "./routes/AuthRoutes.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import { Server } from "socket.io";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
  })
);

app.use(express.json());

app.use("/uploads/recordings", express.static("uploads/recordings"));
app.use("/uploads/images", express.static("uploads/images"));

app.use("/api/auth", AuthRoutes);
app.use("/api/messages", MessageRoutes);

app.get("/healthcheck",(req,res)=>{
  console.log("server is runnnign ")
  res.send("Server is up and running")
})

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

const io = new Server(server, { cors: { origin: "https://whatsapp-clone-2-sigma.vercel.app" } });

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    console.log(userId, socket.id, "socket id add");
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("online-users",{
      onlineUsers: Array.from(onlineUsers.keys())})
  });


  socket.on("signout", (id) => {
    onlineUsers.delete(id);
    socket.broadcast.emit("online-users",{
      onlineUsers: Array.from(onlineUsers.keys())
    })
  })
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log(onlineUsers);
    console.log(sendUserSocket);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", {
        from: data.from,
        message: data.message,
      });
    }
  });
  socket.on("outgoing-voice-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-voice-call", {
          from: data.from,
          roomId: data.roomId,
          callType: data.callType,
        });
    }
  });
  socket.on("outgoing-video-call", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("incoming-video-call", {
          from: data.from,
          roomId: data.roomId,
          callType: data.callType,
        });
    }
  });
  socket.on("reject-voice-call",(data)=>{
    const sendUserSocket = onlineUsers.get(data.from);
    if(sendUserSocket) {
        socket.to(sendUserSocket).emit("voice-call-rejected");
    }
  })
  socket.on("reject-video-call",(data)=>{
    const sendUserSocket = onlineUsers.get(data.from);
    if(sendUserSocket) {
        socket.to(sendUserSocket).emit("video-call-rejected");
    }
  })
  socket.on("accept-incoming-call",({id})=>{
    const sendUserSocket = onlineUsers.get(id);
        socket.to(sendUserSocket).emit("accept-call");
  })

});
