const axios = require("axios");

exports.axiosFunction = async (url, data) => {
  console.log(url, data);
  const result = await axios.post(url, data, {
    headers: {
      'socket-header-key': process.env.HEADERKEY,
      'socket-secret-key': process.env.SECRETKEY
    }
  }); //.then((result) => {
  // console.log(result.data);
  return result.data;
  // });
};

exports.axiosGetFunction = async (url) => {
  console.log(url);
  const result = await axios.get(url, {
    headers: {
      'socket-header-key': process.env.HEADERKEY,
      'socket-secret-key': process.env.SECRETKEY
    }
  }); //.then((result) => {
  // console.log(result.data);
  return result.data;
  // });
};
