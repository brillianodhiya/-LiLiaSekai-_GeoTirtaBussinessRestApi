import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const CheckAuth = (req: Request, res: Response, next: Function) => {
  let geoToken = req.headers["authorization"];

  // console.log(geoToken, "GEO TOKEN");

  if (!geoToken) {
    return res.status(401).send({
      status: 401,
      message: "Request GeoToken",
    });
  }

  try {
    const data = geoToken.split(" ");
    const token = data[1];

    if (process.env.SECREET_KEY_TOKEN) {
      jwt.verify(
        token,
        process.env.SECREET_KEY_TOKEN,
        (err: any, result: any) => {
          if (err) {
            return res.status(400).send({
              status: 400,
              message: err,
            });
          } else {
            res.locals.decodeToken = result;
            next();
          }
        }
      );
    } else {
      return res.status(500).send({
        status: 500,
        message: "Secreet token not defined",
      });
    }
  } catch (error) {
    return res.status(401).send({
      status: 401,
      message: "Request GeoToken",
    });
  }
};

export { CheckAuth };
