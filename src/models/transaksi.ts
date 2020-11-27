import mongoose from "mongoose";
import { InvoiceNumber } from "invoice-number";

interface ITransaksi {
  tanggal_transaksi: string;
  invoice_number: string;
  qty: number;
  total_harga: number;
  status: string;
}

interface TransaksiDoc extends mongoose.Document {
  tanggal_transaksi: string;
  invoice_number: string;
  qty: number;
  total_harga: number;
  status: string;
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
      set: (invoice_before: string) => {
        return InvoiceNumber.next(invoice_before);
      },
      unique: true,
    },
    _ref_product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    qty: {
      type: Number,
      required: true,
    },
    total_harga: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Batal", "Sukses"],
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
  ref: "Product",
  localField: "_ref_product",
  foreignField: "_id",
});

transaksiSchema.set("toJSON", { virtuals: true });

const Transaksi = mongoose.model<TransaksiDoc, TransaksiModelInterface>(
  "Transaksi",
  transaksiSchema
);

export { Transaksi };
