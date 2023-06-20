const express = require("express");
const indexRouter = require("./routes/index");
var path = require("path");
const port = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
