const app = require("./app.js");

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
  );
});
