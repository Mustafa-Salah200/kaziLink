const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 4000;

const url = process.env.DB_URL;
mongoose.connect(url).then(() => {
  app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`);
  });
});
