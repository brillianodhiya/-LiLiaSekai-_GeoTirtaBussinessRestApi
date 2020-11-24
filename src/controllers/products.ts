import { Request, Response } from "express";
import { Products } from "../models/product";

const ProductService = {
  addProduct: async (req: Request, res: Response) => {
    let data = req.body;

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
        data.search
          ? {
              product_name: new RegExp(`${data.search}`),
            }
          : {}
      )
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
        message: error.message,
      });
    }
  },
};

export { ProductService };
