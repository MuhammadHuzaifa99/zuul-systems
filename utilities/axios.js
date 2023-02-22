const axios = require("axios");

exports.axiosFunction = async (url, data) => {
  console.log(url, data);
  const result = await axios.post(url, data, {
    headers: {
      "socket-header-key": process.env.HEADERKEY,
      "socket-secret-key": process.env.SECRETKEY,
    },
  }); //.then((result) => {
  // console.log(result.data);
  return result.data;
  // });
};

exports.axiosGetFunction = async (url, basicAuth = null) => {
  console.log(url);
  let auth;
  if (basicAuth) {
    auth = {
      username: basicAuth.userName,
      password: basicAuth.password,
    };
  }
  const result = await axios.get(url, {
    auth: auth ? auth : null,
    headers: {
      "socket-header-key": process.env.HEADERKEY,
      "socket-secret-key": process.env.SECRETKEY,
    },
  }); //.then((result) => {
  // console.log(result.data);
  return result.data;
  // });
};
