import { Request, Response } from "express";
import { Transaksi } from "../models/transaksi";
import mongoose from "mongoose";
import moment from "moment";
import { myCache } from "../../config/nodeCache";
import { Products } from "../models/product";
import { InvoiceNumber } from "invoice-number";

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
        .sort("-createdAt")
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
        .sort("-createdAt")
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

      // data.invoice_number = dataY;
      data._refCreatedBy = mongoose.Types.ObjectId(res.locals.decodeToken._id);

      data.invoice_number = InvoiceNumber.next(dataY);

      const trans = Transaksi.build(data);

      const productService = await Products.findOne({ _id: data._ref_product });

      if (productService) {
        if (productService.qty <= 0) {
          return res.status(400).send({
            status: 400,
            message: "This product qty is empty",
          });
        }
      }

      let qty;
      if (data.qty && productService) {
        if (data.status == "Sukses" || data.status == "Bon") {
          qty = productService.qty - data.qty;
        }

        await Products.findOneAndUpdate(
          { _id: data._ref_product },
          { qty: qty },
          { new: true }
        );
      }

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
  changeTransactionStatus: async (req: Request, res: Response) => {
    const { invoice_number } = req.params;
    const { status } = req.body;

    if (!invoice_number) {
      return res.status(422).send({
        status: 422,
        message: "Please send invoice number",
      });
    }

    try {
      let inv_data = await Transaksi.findOne({
        invoice_number: invoice_number,
      });

      let { _ref_product } = JSON.parse(JSON.stringify(inv_data));

      console.log(inv_data, "Inv Data");

      if (inv_data?.status == status) {
        return res.status(422).send({
          status: 422,
          message: "Can't change to same status",
        });
      }

      if (status != "Sukses" && status != "Bon" && status != "Batal") {
        return res.status(422).send({
          status: 422,
          message: "Status just can change in Sukses, Bon or Batal",
        });
      }

      const product_data = await Products.findOne({
        _id: _ref_product,
      });

      let qty;

      if (product_data) {
        if (inv_data?.status == "Bon" && status == "Sukses") {
          qty = product_data?.qty;
        }

        if (inv_data?.status == "Sukses" && status == "Bon") {
          qty = product_data?.qty;
        }

        if (inv_data?.status == "Batal" && status == "Bon") {
          qty = product_data?.qty - inv_data.qty;
        }

        if (inv_data?.status == "Batal" && status == "Sukses") {
          qty = product_data?.qty - inv_data.qty;
        }

        if (inv_data?.status == "Sukses" && status == "Batal") {
          qty = product_data?.qty + inv_data.qty;
        }
      } else {
        return res.status(404).send({
          status: 404,
          message: "Product not found",
        });
      }

      const process = await Transaksi.findOneAndUpdate(
        { invoice_number: invoice_number },
        { status: status }
      );
      const productProcess = await Products.findOneAndUpdate(
        { _id: _ref_product },
        { qty: qty }
      );

      return res.status(200).send({
        status: 200,
        processOrder: process,
        productProcess: productProcess,
      });

      // console.log(qty, "QTY");

      // console.log(product_data, "product data");
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
};

export { TransaksiService };
