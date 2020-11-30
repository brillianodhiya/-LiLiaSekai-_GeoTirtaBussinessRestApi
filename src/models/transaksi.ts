import mongoose from "mongoose";

interface ITransaksi {
  tanggal_transaksi: string;
  invoice_number: string;
  qty: number;
  total_harga: number;
  status: string;
  atas_nama: string;
  discount: any;
}

interface TransaksiDoc extends mongoose.Document {
  tanggal_transaksi: string;
  invoice_number: string;
  qty: number;
  total_harga: number;
  status: string;
  atas_nama: any;
  discount: any;
}

interface TransaksiModelInterface extends mongoose.Model<TransaksiDoc> {
  build(attr: ITransaksi): TransaksiDoc;
}

const transaksiSchema = new mongoose.Schema(
  {
    tanggal_transaksi: {
      type: Date,
      required: true,
    },
    invoice_number: {
      type: String,
      // set: (invoice_before: string) => {
      //   return
      // },
      unique: true,
    },
    _ref_product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    qty: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    total_harga: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Batal", "Sukses", "Bon"],
    },
    atas_nama: {
      type: String,
      required: false,
    },
    _refCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

transaksiSchema.statics.build = (attr: ITransaksi) => {
  return new Transaksi(attr);
};

transaksiSchema.virtual("createdBy", {
  ref: "User",
  localField: "_refCreatedBy",
  foreignField: "_id",
});

transaksiSchema.virtual("ProductDetail", {
  ref: "Products",
  localField: "_ref_product",
  foreignField: "_id",
});

transaksiSchema.set("toJSON", { virtuals: true });

const Transaksi = mongoose.model<TransaksiDoc, TransaksiModelInterface>(
  "Transaksi",
  transaksiSchema
);

export { Transaksi };
