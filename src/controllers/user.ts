import { Request, Response } from "express";
import mongoose from "mongoose";
import { Users } from "../models/user";
import jwt from "jsonwebtoken";
import crypto from "crypto-js";
import moment from "moment";

const hash = (data: string) => {
  if (process.env.SECREET_KEY_PW) {
    return crypto.AES.encrypt(data, process.env.SECREET_KEY_PW).toString();
  } else {
    return false;
  }
};

const dehash = (data: string) => {
  if (process.env.SECREET_KEY_PW) {
    return crypto.AES.decrypt(data, process.env.SECREET_KEY_PW).toString(
      crypto.enc.Utf8
    );
  } else {
    return false;
  }
};

const user = {
  register: async (req: Request, res: Response) => {
    let data = req.body;

    try {
      data.password = hash(data.password);
      const user = Users.build(data);
      await user.save();
      return res.status(201).send({
        status: 201,
        result: user,
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
  getAllUser: async (req: Request, res: Response) => {
    const data = req.body;

    try {
      const user = await Users.find(
        data.search
          ? {
              email: new RegExp(data.search),
            }
          : {}
      );

      return res.status(200).send({
        status: 200,
        result: user,
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
  updateUser: async (req: Request, res: Response) => {
    const data = req.body;
    const params = req.params;

    try {
      const user = await Users.findOneAndUpdate({ email: params.email }, data, {
        new: true,
      });
      return res.status(201).send({
        status: 201,
        result: user,
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
  deleteUser: async (req: Request, res: Response) => {
    const params = req.params;

    try {
      const user = await Users.findOneAndDelete({ email: params.email });
      return res.status(201).send({
        status: 201,
        result: user,
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
  login: async (req: Request, res: Response) => {
    const data = req.body;

    if (!data.email) {
      return res.status(400).send({
        status: 400,
        message: "Email is Required!",
      });
    }

    if (!data.password) {
      return res.status(400).send({
        status: 400,
        message: "Password is Required!",
      });
    }

    try {
      let getuser = await Users.findOne({ email: data.email });

      if (!getuser) {
        return res.status(404).send({
          status: 404,
          message: "User not found!",
        });
      }

      const pw = dehash(getuser.password);

      if (pw === data.password) {
        if (process.env.SECREET_KEY_TOKEN) {
          // console.log(getuser, "GET USER");
          jwt.sign(
            {
              _id: getuser._id,
              email: getuser.email,
              username: getuser.username,
              no_hp: getuser.no_hp,
              photo: getuser.photo,
              role: getuser.role,
              createdAt: getuser.toJSON().createdAt,
              updatedAt: getuser.toJSON().updatedAt,
            },
            process.env.SECREET_KEY_TOKEN,
            { expiresIn: "24h" },
            (err: any, token: any) => {
              if (err) {
                console.log(err, "ERR");
                return res.status(400).send({
                  status: 400,
                  message: err.message,
                });
              } else {
                return res.status(200).send({
                  status: 200,
                  result: getuser,
                  expiredIn: moment().add(24, "hours").format(),
                  token: "GeoToken " + token,
                });
              }
            }
          );
        } else {
          return res.status(500).send({
            status: 500,
            message: "Secreet key not setted!",
          });
        }
      } else {
        return res.status(400).send({
          status: 400,
          message: "Password incorrect!",
        });
      }
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
};

export { user };
