import { Request, Response } from "express";
import { myCache } from "../../config/nodeCache";

const CheckCache = (req: Request, res: Response, next: Function) => {
  const url = req.originalUrl;

  let value = myCache.get(url);

  console.log(myCache.keys());

  if (value == undefined) {
    next();
  } else {
    return res.status(200).send(value);
  }
};

const deleteCache = (data: string) => {
  return async (req: Request, res: Response, next: Function) => {
    let keys = myCache.keys();
    let deletedvalue = keys.filter((val) => val.includes(data) === true);

    await myCache.del(deletedvalue);

    // console.log(deletedvalue, "KEYS");

    // console.log(data, "DATA");

    next();
  };
};

export { CheckCache, myCache, deleteCache };
