const express = require("express");
const router = express.Router();
const { get } = require("../utilities/global.socket");

router.route("/start-socket-connection").get((req, res) => {
  return res.status(200).json({
    status: "success",
    message: "Node js deployed on Elastic beanstalk",
  });
});

router.route("/guard/guard-camera").post(async (req, res) => {
  const { socket_id, ...resData } = req.body.data;
  console.log(req.body.data);
  const io = get();
  console.log({ socket_id });
  const data = io.to(socket_id).emit("image-capture", resData);
  console.log("body", data);
  return res.status(200).json({
    status: "success",
    data: data,
  });
});

router.route("/guard/open-gate").post(async (req,res) =>{
  const {socket_id, ...resData} = req.body;
  console.log(socket_id)
  const io = get()
  const data = io.to(socket_id).emit("open-gate", resData)
  return res.status(200).json({
    status: "success",
    data: data
  })
})

module.exports = router;
