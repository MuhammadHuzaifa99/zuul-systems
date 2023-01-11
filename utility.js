const axios = require("axios");

exports.axiosFunction = async (url, data) => {
  console.log(url, data);
  const result = await axios.post(url, data, {
    headers: {
      socketHeaderKey: "sHHydot6qx8H6GZo",
      socketSecretKey: "e4d1Y8ANRFAjNQ7L"
    }
  }); //.then((result) => {
  // console.log(result.data);
  return result.data;
  // });
};
