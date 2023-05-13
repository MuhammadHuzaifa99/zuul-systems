const { axiosFunction, axiosGetFunction } = require("./utilities/axios.js");

const url0 = process.env.URL0; // "https://dev.zuulsystems.com/api";
const url = process.env.URL;

var cameraPi = "";

exports.middlewearFunction = async (socket, next) => {
  // console.log(socket.handshake.auth.zuul_key);
  axiosFunction(`${url}/auth-remote-guard`, {
    zuul_key: socket.handshake.auth.zuul_key,
    zuul_secret: socket.handshake.auth.zuul_secret,
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
};

exports.connectionFunction = async (socket) => {
  console.log("connected", socket.id);

  const remoteId = cameraPi.result[0].id;

  axiosFunction(`${url}/socket-connection`, {
    socketId: socket.id,
    remote_guard_id: remoteId,
  })
    .then((result) => {
      if (!result["bool"]) {
        socket.on("disconnect");
        return;
      }
      console.log("result:", { result });
      socket.emit("connected", { url, data: result });
      return result;
    })
    .catch((err) => {
      console.log("error:", { error: err.message });
      socket.emit("error", { error: err.message });
      return err.message;
    });

  socket.on("scan_pass", async (data) => {
    axiosFunction(`${url}/create-quick-pass`, data)
      .then((result) => {
        console.log({ scan_log_id: result.result.scan_log.id });
        socket.emit("scan_log_id", { scan_log_id: result.result.scan_log.id });
        return { scan_log: result.result.scan_log.id };
      })
      .catch((error) => {
        console.log(error.message);
        socket.emit("error", { error: error.message });
        return error;
      });
  });

  socket.on("image-capture", async (data) => {
    console.log("img", data);
    const objData = { ...data, socket_id: socket.id };

    axiosFunction(`${url}/image-store`, objData)
      .then((result) => {
        console.log({ result });
        return result;
      })
      .catch((error) => {
        console.log({ error: error.message });
        socket.emit("error", { error: error.message });
        return error;
      });
  });

  // socket.on("log-in", async (data) => {
  //   axiosFunction(`${url0}/login`, {
  //     phone_number: data.phoneNumber,
  //     password: data.password,
  //     register_with_phonenumber: 1
  //   }).then(result => {
  //     console.log(result.result.success.token)
  //     socket.emit("log-in", { token: result.result.success.token })
  //   }).catch(err => console.log(err.message))
  // })


  socket.on("get-qr-code", async (data) => {
    // console.log({data})
    axiosFunction(`${url0}/passes`, {
      // "pass_date": "2021-06-02 12:00",
      // "pass_end_date": "2021-06-03 12:00",
      // "pass_validity": "xxx",
      // "created_by": 12477,
      // "isSMS": 0,
      // "pass_type": "self",
      // "visitor_type": "friends_family",
      // "description": " 706 Timbercrest Road Anchorage Alaska 90852",
      // "event_id": "5",
      // "selected_contacts": [
      //   1, 2
      // ],
      // "lat": "1",
      // "lng": "1",
      // "searchTerm": ""

      "pass_date": "2023-03-08T23:28:48.172Z",
      "pass_end_date": "03-10-2023 11:28 PM",
      "pass_validity": "xxx",
      "pass_type": "self",
      "visitor_type": "friends_family",
      "description": " 706 Timbercrest Road Anchorage Alaska 90852",
      "event_id": "5",
      "selected_contacts": [
        1, 2
      ],
      "lat": "1",
      "lng": "1",
      "searchTerm": ""

    }, data.token).then(result => {
      console.log({ result })
      socket.emit("get-qr-code", { qrCode: result.result })
    }).catch(err => console.log({ error: err.message }))
  })

  socket.on("scan-qr-code", async (data) => {
    console.log(data);
    axiosGetFunction(`${url}/scanned-qr-code/guard/${data.id}/${data.code}?guard_type=remote_guard&&guard_id=18079`)//, "", data.token)
      .then((res) => {
        console.log({ res });
        if (res["bool"] == true) {
          socket.emit("scan_log_id", { scan_log_id: res.result.scan_log.id });
        }
      })
      .catch((err) => {
        console.log({ error: err.message });
        socket.emit("error", { error: err.message });
      });
  });


  socket.on("get_all_rf_code", async (data) => {
    console.log(data)
    axiosGetFunction(`${url}/get_all_rf_code/${data.remoteGuardId}`, {
      userName: data.userName,
      password: data.password,
    }).then(res => {
      // console.log({ res });
      let rfidCodes = res.result.data.split("\n")
      socket.emit("get_all_rf_code", rfidCodes)
      // console.log(rfidCodes);
    }).catch(err => {
      console.log(err.message);
      socket.emit("error", { error: err.message });
    })
  })


  socket.on("scan-rfid", async (data) => {
    console.log({ data });
    axiosGetFunction(`${url}/scanned_rf_code/${data.remoteGuardId}/${data.rfidCode}`)
      .then((res) => {
        console.log({ res });
        socket.emit("scan-rfid", res);
      })
      .catch((err) => {
        console.log({ error: err.message });
        socket.emit("error", { error: err.message });
      });
  });

  socket.on("web-relay", async (data) => {
    console.log(data)
    axiosFunction(`${url}/open-web-relay`, {
      web_relay_id: data.web_relay,
      remote_guard_id: data.remote_guard,
      type: data.type,
      scan_log_id: 0,
      // ignore_scan_log_id: true
    }).then(result => {
      console.log(result)
      socket.emit('web-relay', result)
    }).catch(err => console.log({ error: err.message }))
  })

  socket.on("resident-list", async data => {
    console.log(data)

    axiosFunction(`${url}/get-guard-residents`, {
      remote_guard: data.remoteGuardId
    }).then(result => {
      console.log(result)
      socket.emit('resident-list', result)
    }
    )
  })
};