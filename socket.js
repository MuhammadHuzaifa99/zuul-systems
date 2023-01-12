const { axiosFunction } = require("./utility.js");

// const url = "https://dev.zuulsystems.com/api"; //process.env.URL;
const url = process.env.URL;

var cameraPi = ""

exports.middlewearFunction = async (socket, next) => {
    console.log(socket.handshake.auth.site_identifier);
    axiosFunction(`${url}/auth-camera`, {
      macAddress: socket.handshake.auth.site_identifier,
      secretKey: socket.handshake.auth.psk,
    })
      .then((result) => {
        console.log("result done:", { result });
        if (result["bool"] == true) {
          cameraPi = result;
          return next();
        } else {
          socket.disconnect();
        }
      })
      .catch((err) => {
        console.log("result error:", { error: err.message });
        socket.disconnect();
      });
  }



 exports.connectionFunction =  async (socket) => {
    console.log("connected", socket.id);

    const macAddress = cameraPi.result[0].mac_address;

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
  }
