const express = require("express");
const app = express();
const router = express.Router();
const { axiosFunction } = require("./utility.js");
router.route("/").get((req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Node js deployed on Elastic beanstalk",
  });
});
router.route("/start-socket-connection").get((req, res) => {
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

const url = "https://dev.zuulsystems.com/api"; //process.env.URL;
// const url = process.env.URL;

io.use(async (socket, next) => {
  console.log(socket.handshake.auth.site_identifier);
  axiosFunction(`${url}/auth-camera`, {
    macAddress: socket.handshake.auth.site_identifier,
    secretKey: socket.handshake.auth.psk,
  })
    .then((result) => {
      console.log("result done:", { result });
      if (result["bool"] == true) {
        io.cameraPi = result;
        return next();
      } else {
        socket.disconnect();
      }
    })
    .catch((err) => {
      console.log("result error:", { error: err.message });
      socket.disconnect();
      // next(new Error("Authentication error"));
    });
});

io.on("connection", async (socket) => {
  console.log("connected", socket.id);

  const macAddress = io.cameraPi.result[0].mac_address;

  axiosFunction(`${url}/socket-connection`, {
    socketId: socket.id,
    mac: macAddress,
  })
    .then((result) => {
      console.log("result:", { result });
      socket.emit("connected", url);
      return result;
    })
    .catch((err) => {
      console.log("error:", { error: err.message });
      socket.emit("error", { error: err.message });
      return err.message;
    });

  // console.log("Socket connection stablished");

  socket.on("image-capture", async (data) => {
    console.log("img", data);
    const objData = { data: data };

    axiosFunction(`${url}/image-store`, objData)
      .then((result) => {
        console.log({ result });
        return result;
      })
      .catch((error) => {
        console.log({ error: error.message });
        socket.emit("error", { error: err.message });
        return error;
      });
  });
});

app.post("/api/v1/guard/guard-camera", async (req, res) => {
  const { socket_id, ...resData } = req.body.data;
  console.log("image-capture", resData);
  const data = io.to(socket_id).emit("image-capture", resData);
  console.log("body", data);
  return res.status(200).json({
    status: "success",
    data: data,
  });
});

module.exports = server;
