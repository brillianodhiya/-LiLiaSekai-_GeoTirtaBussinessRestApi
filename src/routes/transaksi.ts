import express from "express";
import { TransaksiService } from "../controllers/transaksi";
import { CheckAuth } from "../middleware/auth";
import { TransaksiCache } from "../middleware/nodeCacheMidleware";

const router = express.Router();

router.get("/all", TransaksiCache, CheckAuth, TransaksiService.GetProductAll);
router.get(
  "/:page/:size",
  TransaksiCache,
  CheckAuth,
  TransaksiService.GetProduct
);
router.post("/", CheckAuth, TransaksiService.doTransaction);

export { router as TransaksiRouter };
