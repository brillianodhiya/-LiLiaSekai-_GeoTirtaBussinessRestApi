import mongoose from "mongoose";

interface ITransaksiV2 {
  tanggal_transaksi: string;
  invoice_number: string;
  //   products: [mongoose.Schema.Types.Number];
  total_harga: number;
  status: String;
  disc: number;
  atas_nama: any;
}

interface TransaksiV2Doc extends mongoose.Document {
  tanggal_transaksi: string;
  invoice_number: string;
  //   products: [mongoose.Schema.Types.Number];
  total_harga: number;
  status: String;
  disc: number;
  atas_nama: any;
}

interface TransaksiV2ModelInterface extends mongoose.Model<TransaksiV2Doc> {
  build(attr: ITransaksiV2): TransaksiV2Doc;
}

const transaksiv2Schema = new mongoose.Schema(
  {
    tanggal_transaksi: {
      type: Date,
      required: true,
    },
    invoice_number: {
      type: String,
      unique: true,
      required: true,
    },
    _ref_products: [
      {
        ref: "detail_transaksi",
        type: String,
      },
    ],
    total_harga: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    disc: {
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
    note: {
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

transaksiv2Schema.statics.build = (attr: ITransaksiV2) => {
  return new TransaksiV2(attr);
};

transaksiv2Schema.virtual("createdBy", {
  ref: "User",
  localField: "_refCreatedBy",
  foreignField: "_id",
});

transaksiv2Schema.virtual("products", {
  ref: "detail_transaksi",
  localField: "invoice_number",
  foreignField: "ref_transaksi",
});

transaksiv2Schema.set("toJSON", { virtuals: true });

const TransaksiV2 = mongoose.model<TransaksiV2Doc, TransaksiV2ModelInterface>(
  "TransaksiV2",
  transaksiv2Schema
);

export { TransaksiV2 };
