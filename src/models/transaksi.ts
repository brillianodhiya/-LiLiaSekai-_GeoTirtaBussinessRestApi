import mongoose from "mongoose";

interface ITransaksi {}

const transaksiSchema = new mongoose.Schema(
  {
    tanggal_transaksi: {
      type: Date,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    total_harga: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
