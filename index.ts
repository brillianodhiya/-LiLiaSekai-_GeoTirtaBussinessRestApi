import express from "express";
import { json } from "body-parser";
import dotenv from "dotenv";
import { MongoSetup } from "./config/mongo";

import { todoRouter } from "./src/routes/todo";

dotenv.config();

const app = express();
app.use(json());

// view engine
app.set("view engine", "pug");
app.get("/", (req, res) => {
  res.render("index", {
    title: "LiLia Dev",
    message: "Wellcome to GeoTirta Service App",
  });
});

// imported routes
app.use("/test", todoRouter);

MongoSetup(process.env.DB_URL);

app.listen(process.env.PORT, () => {
  console.log("Server is listening on port " + process.env.PORT);
});
