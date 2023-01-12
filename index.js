require("dotenv").config();
const {server} = require("./app");

const port = 8080;

server.listen(port, () => {
  console.log("server listen on port", port);
});