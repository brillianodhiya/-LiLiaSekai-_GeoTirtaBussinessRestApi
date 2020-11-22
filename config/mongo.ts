import mongoose from "mongoose";

const MongoConfig = (url: any) => {
  mongoose
    .connect(url, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => {
      console.log("DB Connection Error ", err);
    });
};

export { MongoConfig as MongoSetup };
