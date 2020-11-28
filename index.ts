import express from "express";
import { json } from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import winston from "winston";
import expressWinston from "express-winston";
import { MongoSetup } from "./config/mongo";
import { todoRouter } from "./src/routes/todo";
import { UserRouter } from "./src/routes/user";
import { ProductRouter } from "./src/routes/product";
import { TransaksiRouter } from "./src/routes/transaksi";

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
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: (req, res) => {
      return false;
    },
  })
);
app.use(cors());

// imported routes
app.use("/test", todoRouter);
app.use("/user", UserRouter);
app.use("/product", ProductRouter);
app.use("/transaksi", TransaksiRouter);

MongoSetup(process.env.DB_URL);

app.listen(process.env.PORT, () => {
  console.log("Server is listening on port " + process.env.PORT);
});
