import { Request, Response } from "express";
import { Transaksi } from "../models/transaksi";
import mongoose from "mongoose";

const TransaksiService = {
  GetProduct: async (req: Request, res: Response) => {
    const data = req.query;
    const pagination = req.params;

    const page = parseInt(pagination.page) || 1;
    const size = parseInt(pagination.size) || 10;

    try {
      const sTransaksi = await Transaksi.find(
        data.invoice_number
          ? { invoice_number: new RegExp(`${data.invoice_number}`) }
          : {}
      )
        .populate("createdBy", ["username", "email"])
        .populate("ProductDetail")
        .skip((page - 1) * size)
        .limit(size);

      const total = await Transaksi.countDocuments();

      return res.status(200).send({
        status: 200,
        page: page,
        size: size,
        total: total,
        result: sTransaksi,
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
  GetProductAll: async (req: Request, res: Response) => {
    try {
      const sTransaksi = await Transaksi.find();

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
};

export { TransaksiService };
