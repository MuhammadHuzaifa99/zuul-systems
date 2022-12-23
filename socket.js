const express = require("express");
const app = express();
const router = express.Router();
// app.use(appRoutes);
router.route("/").get((req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Node js deployed on Elastic beanstalk",
  });
});


app.use(router);
//middlewears
app.use(express.json());

const server = require("http").createServer(app);

const socket = require("socket.io");
const io = socket(server);
io.use(async (socket, next) => {
    console.log({ socket });
    return next();
});

io.on("connection", async (socket) => {
    console.log("connected")
})


module.exports = server;
