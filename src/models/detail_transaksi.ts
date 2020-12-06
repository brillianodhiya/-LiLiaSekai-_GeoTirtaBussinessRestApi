import mongoose from "mongoose";

const detailTransaksiSchema = new mongoose.Schema(
  {
    ref_transaksi: {
      type: String,
      required: true,
    },
    ref_product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Products",
    },
    nama_produk: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    harga: {
      type: Number,
      required: true,
    },
    disc: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

detailTransaksiSchema.virtual("detail_product", {
  ref: "Products",
  localField: "ref_product",
  foreignField: "_id",
});

detailTransaksiSchema.set("toJSON", { virtuals: true });

const DetailTrans = mongoose.model("detail_transaksi", detailTransaksiSchema);

export { DetailTrans };
