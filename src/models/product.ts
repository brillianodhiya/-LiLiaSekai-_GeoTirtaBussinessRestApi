import mongoose from "mongoose";

interface IProducts {
  product_name: string;
  qty: number;
  price: number;
}

interface ProductDoc extends mongoose.Document {
  product_name: string;
  qty: number;
  price: number;
}

interface ProductModelInterface extends mongoose.Model<ProductDoc> {
  build(attr: IProducts): ProductDoc;
}

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.statics.build = (attr: IProducts) => {
  return new Products(attr);
};

const Products = mongoose.model<ProductDoc, ProductModelInterface>(
  "Products",
  productSchema
);

export { Products };
