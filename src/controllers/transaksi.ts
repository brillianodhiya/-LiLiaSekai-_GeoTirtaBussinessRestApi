import { Request, Response } from "express";
import { Transaksi } from "../models/transaksi";
import mongoose from "mongoose";
import moment from "moment";
import { myCache } from "../../config/nodeCache";

function getReq(obj: any) {
  return obj;
}
function kFormatter(num: any) {
  return Math.abs(num) > 999
    ? (Math.sign(num) * (Math.abs(num) / 1000)).toFixed(0) + "k"
    : Math.sign(num) * Math.abs(num);
}

const TransaksiService = {
  GetProduct: async (req: Request, res: Response) => {
    let data = getReq(req.query);
    const pagination = req.params;

    if (data.search) {
      data.invoice_number = new RegExp(`${data.search}`);
    }

    const page = parseInt(pagination.page) || 1;
    const size = parseInt(pagination.size) || 10;

    const url = req.originalUrl;

    try {
      const sTransaksi = await Transaksi.find(data)
        .populate("createdBy", ["username", "email"])
        .populate("ProductDetail", ["product_name", "price", "qty", "display"])
        .skip((page - 1) * size)
        .limit(size);

      const total = await Transaksi.countDocuments();

      myCache.set(
        url,
        {
          status: 200,
          page: page,
          size: size,
          total: total,
          result: sTransaksi,
        },
        3600
      );

      return res.status(200).send({
        status: 200,
        page: page,
        size: size,
        total: total,
        result: sTransaksi,
      });
    } catch (error) {
      console.log(error, "ERROR");
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
  GetProductAll: async (req: Request, res: Response) => {
    const data = req.query;

    const url = req.originalUrl;

    // console.log(url, "url");

    try {
      const sTransaksi = await Transaksi.find(data)
        .populate("createdBy", ["username", "email"])
        .populate("ProductDetail", ["product_name", "price", "qty", "display"]);

      myCache.set(
        url,
        {
          status: 200,
          result: sTransaksi,
        },
        3600
      );

      return res.status(200).send({
        status: 200,
        result: sTransaksi,
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
  doTransaction: async (req: Request, res: Response) => {
    const data = req.body;

    try {
      const last_inv = await Transaksi.findOne({}).sort("-createdAt");
      const val = last_inv ? last_inv.invoice_number : "";

      const date = moment().format("YYYY");
      const countYear = date.split("").slice(-2).join("");

      const stringYearK = (kFormatter(date) + countYear).toUpperCase();

      let dataY = "";

      if (val.includes(stringYearK)) {
        dataY = val;
      } else {
        dataY = "GT" + stringYearK + "0000";
      }

      data.invoice_number = dataY;
      data._refCreatedBy = mongoose.Types.ObjectId(res.locals.decodeToken._id);

      const trans = Transaksi.build(data);

      await trans.save();

      return res.status(201).send({
        status: 201,
        result: trans,
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
};

export { TransaksiService };
