import express from "express";
import { transaksiV2Controller } from "../controllers/transaksiv2";
import { CheckAuth } from "../middleware/auth";
import { CheckCache, deleteCache } from "../middleware/nodeCacheMidleware";

const router = express.Router();

router.post(
  "/",
  CheckAuth,
  deleteCache("/transaksiv2"),
  transaksiV2Controller.doTransaction
);
router.get(
  "/:page/:size",
  CheckAuth,
  CheckCache,
  transaksiV2Controller.GetTransaksi
);

export { router as TransaksiV2R };
