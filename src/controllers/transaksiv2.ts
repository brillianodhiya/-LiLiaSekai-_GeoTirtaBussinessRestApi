import { Request, Response } from "express";
import { TransaksiV2 } from "../models/transaksiv2";
import { DetailTrans } from "../models/detail_transaksi";
import moment from "moment";
import mongoose from "mongoose";
import { InvoiceNumber } from "invoice-number";
import { myCache } from "../../config/nodeCache";
import { Products } from "../models/product";

function getReq(obj: any) {
  return obj;
}
function kFormatter(num: any) {
  return Math.abs(num) > 999
    ? (Math.sign(num) * (Math.abs(num) / 1000)).toFixed(0) + "k"
    : Math.sign(num) * Math.abs(num);
}

const transaksiV2Controller = {
  doTransaction: async (req: Request, res: Response) => {
    const data = req.body;

    interface IProduct {
      ref_transaksi: any;
      ref_product: String;
      nama_produk: String;
      qty: number;
      harga: number;
      disc: number;
    }

    let products: Array<IProduct>;

    try {
      products = data.products;
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }

    if (data.status == "Bon" && !data.atas_nama) {
      return res.status(422).send({
        status: 422,
        message: "Atas Nama Harus diisi jika Status Bon",
      });
    }

    if (Array.isArray(products)) {
      try {
        data._refCreatedBy = mongoose.Types.ObjectId(
          res.locals.decodeToken._id
        );

        const last_inv = await TransaksiV2.findOne({}).sort("-createdAt");
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

        const invoice_number = InvoiceNumber.next(dataY);
        let productid = new Array();
        // let updateQty: readonly any[] = [];
        let updateQty = new Array();

        products.map((val: any, idx: any) => {
          products[idx].ref_transaksi = invoice_number;
          productid.push(val.ref_product);
          // updateQty.push(new Promise(async (resolve,  reject ) => {
          //   const r = await Products.findOne({ _id: val.ref_product })
          //   resolve(r)
          // }));

          if (data.status == "Sukses" || data.status == "Bon") {
            updateQty.push(
              Products.findOneAndUpdate(
                { _id: val.ref_product },
                { $inc: { qty: -val.qty } },
                { new: true }
              )
            );
          } else if (data.status == "Batal") {
            // updateQty.push(
            //   Products.findOneAndUpdate(
            //     { _id: val.ref_product },
            //     { $inc: { qty: val.qty } },
            //     { new: true }
            //   )
            // );
          }
        });

        // console.log(updateQty, "SSS")

        let updateqty_ = await Promise.all(updateQty).then((ok) => {
          return ok;
        });

        console.log(updateqty_);

        data.invoice_number = invoice_number;
        // console.log(products, "PRODUCTS");

        const trans = TransaksiV2.build(data);
        await DetailTrans.insertMany(products);

        await trans.save();

        return res.status(201).send({
          status: 201,
          result: trans,
          // details: detail_trans,
        });
      } catch (error) {
        return res.status(400).send({
          status: 400,
          message: error,
        });
      }
    } else {
      return res.status(400).send({
        status: 400,
        message: "Products Field Should be array",
      });
    }
  },
  GetTransaksi: async (req: Request, res: Response) => {
    let data = getReq(req.query);

    const pagination = req.params;

    if (data.search) {
      data.invoice_number = new RegExp(`${data.search}`);
    }

    const page = parseInt(pagination.page) || 1;
    const size = parseInt(pagination.size) || 10;

    const url = req.originalUrl;

    try {
      const sTransaksi = await TransaksiV2.find(data)
        .sort("-createdAt")
        .populate("createdBy", ["username", "email"])
        .populate("products", [
          "ref_product",
          "nama_produk",
          "qty",
          "harga",
          "disc",
          "ref_transaksi",
          "createdAt",
          "updatedAt",
        ])
        .skip((page - 1) * size)
        .limit(size);

      const total = await TransaksiV2.countDocuments();

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
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
};

export { transaksiV2Controller };
