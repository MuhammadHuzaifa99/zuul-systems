require("dotenv").config();
const server = require("./socket");

const port = 8080;

server.listen(port, () => {
  console.log("server listen on port", port);
});