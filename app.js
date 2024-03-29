const express = require("express");
const app = express();
const { authCheck } = require("./middlewears/middlewear");
const server = require("http").createServer(app);
const { set } = require("./utilities/global.socket.js");
const cors = require('cors');
const socket = require("socket.io");
const { middlewearFunction, connectionFunction } = require("./socket");

app.use(cors({
  origin: '*'
}));

const io = socket(server)

//socket middlewears
io.use(middlewearFunction);

//socket connection
io.on("connection", connectionFunction);

//set io
set(io)

const socketRouter = require("./routes/socket.routes")
app.use(express.json());

//middlewears
app.use(authCheck);

//routes
app.get("/", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Node js deployed on Elastic beanstalk",
  });
});

app.use("/api/v1", socketRouter);

module.exports = { server };

