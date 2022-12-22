const server = require("./socket");

const port = 5000;

server.listen(port, () => {
  console.log("server listen on port", port);
});
