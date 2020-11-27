import { Request, Response } from "express";
import { Products } from "../models/product";
import mongoose from "mongoose";

const ProductService = {
  addProduct: async (req: Request, res: Response) => {
    let data = req.body;

    data._refCreatedBy = mongoose.Types.ObjectId(res.locals.decodeToken._id);

    try {
      const product = Products.build(data);
      await product.save();
      return res.status(201).send({
        status: 201,
        result: product,
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
  GetProduct: async (req: Request, res: Response) => {
    const pagination = req.params;

    const data = req.query;

    const page = parseInt(pagination.page) || 1;
    const size = parseInt(pagination.size) || 10;

    try {
      const product = await Products.find(
        data.product_name
          ? {
              product_name: new RegExp(`${data.product_name}`),
            }
          : {}
      )
        .populate("createdBy", ["username", "email"])
        .skip((page - 1) * size)
        .limit(size);

      const total = await Products.countDocuments();

      return res.status(200).send({
        status: 200,
        page: page,
        size: size,
        total: total,
        result: product,
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
  UpdateProduct: async (req: Request, res: Response) => {
    const data = req.body;
    const params = req.params;

    // console.log(res.locals.decodeToken, "DECODE TOKEN");

    data._refCreatedBy = mongoose.Types.ObjectId(res.locals.decodeToken._id);

    // console.log(data, "DATAA");

    let id;

    try {
      id = mongoose.Types.ObjectId(params.id);
    } catch (error) {
      return res.status(422).send({
        status: 422,
        message: "Opps...!!! it seems not like geo tirta id",
      });
    }

    try {
      const product = await Products.findOneAndUpdate({ _id: id }, data, {
        new: true,
      });

      return res.status(201).send({
        status: 201,
        result: product,
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
  DeleteProduct: async (req: Request, res: Response) => {
    const params = req.params;

    let id;

    try {
      id = mongoose.Types.ObjectId(params.id);
    } catch (error) {
      return res.status(422).send({
        status: 422,
        message: "Opps...!!! it seems not like geo tirta id",
      });
    }

    try {
      const product = await Products.findOneAndDelete({ _id: id });

      return res.status(201).send({
        status: 201,
        result: product,
      });
    } catch (error) {
      return res.status(400).send({
        status: 400,
        message: error,
      });
    }
  },
};

export { ProductService };
