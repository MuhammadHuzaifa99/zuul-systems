let io;
module.exports = {
  get: () => {
    if (!io) {
      console.log("socket is not initialized");
    }
    return io;
  },
  set: (s) => {
    io = s;
  }
};