import { Request, Response } from "express";
import redis from "redis";

const client = redis.createClient();

const redisCache = (req: Request, res: Response, next: Function) => {
  const url = req.url || req.baseUrl;

  client.get(url, (err: any, data: any) => {
    if (err) throw err;

    if (data != null) {
      res.status(200).send(JSON.parse(data));
    } else {
      next();
    }
  });
};

export { redisCache };
