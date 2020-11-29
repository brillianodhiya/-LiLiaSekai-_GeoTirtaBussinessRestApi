import express from "express";
import { TransaksiService } from "../controllers/transaksi";
import { CheckAuth } from "../middleware/auth";
import { CheckCache, deleteCache } from "../middleware/nodeCacheMidleware";

const router = express.Router();

router.get("/all", CheckAuth, CheckCache, TransaksiService.GetProductAll);
router.get("/:page/:size", CheckAuth, CheckCache, TransaksiService.GetProduct);
router.post(
  "/",
  CheckAuth,
  deleteCache("/transaksi"),
  TransaksiService.doTransaction
);

export { router as TransaksiRouter };
