const axios = require("axios");

exports.axiosFunction = async (url, data) => {
  console.log(url, data);
  const result = await axios.post(url, data, {
    headers: {
      socketHeaderKey: process.env.HEADERKEY,
      socketSecretKey: process.env.SECRETKEY
    }
  }); //.then((result) => {
  // console.log(result.data);
  return result.data;
  // });
};
