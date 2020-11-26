import mongoose from "mongoose";

interface IProducts {
  product_name: string;
  qty: number;
  price: number;
  display: any;
  createdBy: string;
}

interface ProductDoc extends mongoose.Document {
  product_name: string;
  qty: number;
  price: number;
  display: any;
  createdBy: string;
}

interface ProductModelInterface extends mongoose.Model<ProductDoc> {
  build(attr: IProducts): ProductDoc;
}

const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      unique: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    display: {
      type: Boolean,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

productSchema.statics.build = (attr: IProducts) => {
  return new Products(attr);
};

productSchema.virtual("createdBy", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
});

productSchema.set("toJSON", { virtuals: true });

const Products = mongoose.model<ProductDoc, ProductModelInterface>(
  "Products",
  productSchema
);

export { Products };
