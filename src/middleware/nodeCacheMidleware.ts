import { Request, Response } from "express";
import { myCache } from "../../config/nodeCache";

const TransaksiCache = (req: Request, res: Response, next: Function) => {
  const url = req.originalUrl;

  let value = myCache.get(url);

  if (value == undefined) {
    next();
  } else {
    return res.status(200).send(value);
  }
};

export { TransaksiCache, myCache };
